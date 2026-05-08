import type { NextApiRequest } from 'next';
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

function trimText(value: string, maxLength: number) {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function formatAmount(amount: number) {
  return Number(amount || 0).toFixed(2);
}

export function buildMaxPayPaymentUrl(order: ShopTestOrder, req: NextApiRequest) {
  const config = getMaxPayConfig(req);
  const missing = getMissingMaxPayEnv(config);

  if (!config.enabled) {
    throw new Error('MAXPAY_ENABLE_CORE_CHECKOUT is disabled');
  }

  if (missing.length > 0) {
    throw new Error(`Missing Max Pay env vars: ${missing.join(', ')}`);
  }

  const url = new URL(config.endpoint);
  const customerName = order.customer?.fullName || 'ShopTest Customer';
  const email = order.customer?.email || order.email || '';
  const phone = order.customer?.phone || '';
  const itemSummary = trimText(
    (order.items || []).map((item) => `${item.name} x ${item.quantity}`).join(', ') || `ShopTest order ${order.id}`,
    120
  );

  url.searchParams.set('action', 'pay');
  url.searchParams.set('Masof', config.terminal);
  url.searchParams.set('Amount', formatAmount(order.total));
  url.searchParams.set('Coin', '1');
  url.searchParams.set('Info', itemSummary);
  url.searchParams.set('Order', order.id);
  url.searchParams.set('ClientName', trimText(customerName, 80));
  url.searchParams.set('email', email);
  url.searchParams.set('phone', phone);
  url.searchParams.set('UTF8', 'True');
  url.searchParams.set('UTF8out', 'True');
  url.searchParams.set('MoreData', 'True');
  url.searchParams.set('SendHesh', 'False');
  url.searchParams.set('PageLang', 'HEB');
  url.searchParams.set('PassP', config.password);
  url.searchParams.set('UserId', config.user);
  url.searchParams.set('SuccessUrl', config.successUrl);
  url.searchParams.set('ErrorUrl', config.failedUrl);
  url.searchParams.set('CancelUrl', config.cancelUrl);
  url.searchParams.set('NotifyUrl', config.notifyUrl);

  return url.toString();
}
