import type { NextApiRequest, NextApiResponse } from 'next';
import { updateOrderById } from '../../../lib/db';
import { getMaxPayConfig } from '../../../lib/maxpay/config';
import { validateResponseMac } from '../../../lib/maxpay/response-mac';

function readParam(source: Record<string, any>, names: string[]) {
  for (const name of names) {
    if (source[name] !== undefined) return String(source[name]);
  }
  return '';
}

function isApproved(source: Record<string, any>) {
  const errorCode = readParam(source, ['errorCode', 'ErrorCode']);
  const status = readParam(source, ['status', 'Status', 'CCode', 'ccode']);
  return errorCode === '000' || status === '000' || status === '0' || status.toLowerCase() === 'approved' || status.toLowerCase() === 'success';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = {
    ...(req.query || {}),
    ...(req.method === 'POST' && typeof req.body === 'object' ? req.body : {}),
  };

  const orderId = readParam(payload, ['uniqueId', 'uniqueid', 'UniqueId', 'uniqueID', 'Order', 'order', 'OrderId', 'orderId']);
  const config = getMaxPayConfig(req);
  const macResult = validateResponseMac(payload, config.password);
  const approved = isApproved(payload);

  if (orderId) {
    await updateOrderById(orderId, {
      paymentProvider: 'maxpay_hyp',
      paymentStatus: approved ? 'paid' : 'payment_failed',
      status: approved ? 'paid' : 'payment_failed',
      maxPay: {
        env: config.env,
        lastCallbackAt: new Date().toISOString(),
        responseMacValid: macResult.valid,
        responseMacReason: macResult.reason,
        hypTransactionId: readParam(payload, ['txId', 'TxId', 'transactionId', 'Id', 'id', 'ACode', 'TransId']),
        hypStatusCode: readParam(payload, ['errorCode', 'ErrorCode', 'status', 'Status', 'CCode', 'ccode']),
      },
    });
  }

  return res.status(200).json({
    ok: true,
    orderId: orderId || null,
    paymentStatus: approved ? 'paid' : 'payment_failed',
    responseMac: macResult.valid ? 'valid' : macResult.reason,
  });
}
