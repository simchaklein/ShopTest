import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrderById, updateOrderById } from '../../../lib/db';
import { createMaxPayPaymentRequest } from '../../../lib/maxpay/payment-request';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body || {};
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { paymentUrl } = await createMaxPayPaymentRequest(order, req);

    await updateOrderById(order.id, {
      paymentProvider: 'maxpay_hyp',
      paymentStatus: 'pending_payment',
      status: 'awaiting_payment',
      maxPay: {
        env: process.env.MAXPAY_ENV || 'test',
        paymentStartedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      paymentUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Could not create Max Pay payment request',
    });
  }
}
