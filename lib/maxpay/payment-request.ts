import type { NextApiRequest } from 'next';
import { randomUUID } from 'crypto';
import { getMaxPayConfig, getMissingMaxPayEnv } from './config';

type OrderItem = {
  name: string;
  quantity: number;
};

type ShopTestOrder = {
  id: string;
  total: number;
  customer?: {
    email?: string;
    fullName?: string;
    phone?: string;
  };
  email?: string;
  items?: OrderItem[];
};

function escapeXml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function trimText(value: string, maxLength: number) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function toAgorot(amount: number) {
  return String(Math.round(Number(amount || 0) * 100));
}

function extractHostedPaymentUrl(responseText: string) {
  const match = responseText.match(/<mpiHostedPageUrl>([^<]+)<\/mpiHostedPageUrl>/i)
    || responseText.match(/<paymentUrl>([^<]+)<\/paymentUrl>/i)
    || responseText.match(/https?:\/\/[^\s<"]+/i);

  if (!match) return '';
  return match[1] || match[0];
}

function buildTxnSetupXml(order: ShopTestOrder, req: NextApiRequest) {
  const config = getMaxPayConfig(req);
  const itemSummary = trimText(
    (order.items || []).map((item) => `${item.name} x ${item.quantity}`).join(', ') || `ShopTest order ${order.id}`,
    120
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<ashrait>
  <request>
    <version>2000</version>
    <language>HEB</language>
    <command>doDeal</command>
    <doDeal>
      <terminalNumber>${escapeXml(config.terminal)}</terminalNumber>
      <cardNo>CGMPI</cardNo>
      <total>${escapeXml(toAgorot(order.total))}</total>
      <transactionType>Debit</transactionType>
      <creditType>RegularCredit</creditType>
      <currency>ILS</currency>
      <transactionCode>Internet</transactionCode>
      <validation>TxnSetup</validation>
      <mid>${escapeXml(config.mid)}</mid>
      <uniqueid>${escapeXml(order.id || randomUUID())}</uniqueid>
      <mpiValidation>AutoComm</mpiValidation>
      <description>${escapeXml(itemSummary)}</description>
      <customerData>
        <userData1>${escapeXml(order.customer?.email || order.email || '')}</userData1>
        <userData2>${escapeXml(order.customer?.fullName || '')}</userData2>
        <userData3>${escapeXml(order.customer?.phone || '')}</userData3>
      </customerData>
      <successUrl>${escapeXml(config.successUrl)}</successUrl>
      <errorUrl>${escapeXml(config.failedUrl)}</errorUrl>
      <cancelUrl>${escapeXml(config.cancelUrl)}</cancelUrl>
      <notifyUrl>${escapeXml(config.notifyUrl)}</notifyUrl>
    </doDeal>
  </request>
</ashrait>`;
}

function buildYaadPayHostedUrl(order: ShopTestOrder, req: NextApiRequest) {
  const config = getMaxPayConfig(req);
  const params = new URLSearchParams({
    Masof: config.terminal,
    Amount: String(Number(order.total || 0).toFixed(2)),
    Order: order.id || randomUUID(),
    Info: trimText(
      (order.items || []).map((item) => `${item.name} x ${item.quantity}`).join(', ') || `ShopTest order ${order.id}`,
      120
    ),
    UTF8: 'True',
    UTF8out: 'True',
    MoreData: 'True',
  });

  if (order.customer?.email || order.email) params.set('email', order.customer?.email || order.email || '');
  if (order.customer?.fullName) params.set('ClientName', order.customer.fullName);
  if (order.customer?.phone) params.set('phone', order.customer.phone);

  const url = new URL(config.paymentPageUrl);
  params.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}

export async function createMaxPayPaymentRequest(order: ShopTestOrder, req: NextApiRequest) {
  const config = getMaxPayConfig(req);
  const missing = getMissingMaxPayEnv(config);

  if (!config.enabled) {
    throw new Error('MAXPAY_ENABLE_CORE_CHECKOUT is disabled');
  }

  if (missing.length > 0) {
    throw new Error(`Missing Max Pay env vars: ${missing.join(', ')}`);
  }

  if (config.providerMode === 'yaadpay_hosted') {
    if (config.apiKey || config.passp) {
      // API Key / PassP are intentionally not added to the browser redirect URL.
      // The Hyp panel should hold hosted-page authentication and callback settings.
    }

    return {
      paymentUrl: buildYaadPayHostedUrl(order, req),
      providerResponse: {
        status: 200,
        hasHostedUrl: true,
        providerMode: config.providerMode,
      },
    };
  }

  const body = new URLSearchParams({
    user: config.user,
    password: config.password,
    int_in: buildTxnSetupXml(order, req),
  });

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body,
  });

  const responseText = await response.text();
  const paymentUrl = extractHostedPaymentUrl(responseText);

  if (!response.ok || !paymentUrl) {
    throw new Error('Hyp did not return a hosted payment URL');
  }

  return {
    paymentUrl,
    providerResponse: {
      status: response.status,
      hasHostedUrl: Boolean(paymentUrl),
      providerMode: config.providerMode,
    },
  };
}
