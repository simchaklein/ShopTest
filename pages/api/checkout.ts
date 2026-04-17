import type { NextApiRequest, NextApiResponse } from 'next';
import { addOrder } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, total, email, cardNumber, expiryDate, cvv } = req.body;

    if (!items || !total || !email || !cardNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real implementation, this would call the Max Pay MCP
    // For now, we'll simulate a successful payment
    const simulateMaxPayCall = async () => {
      // Placeholder for Max Pay MCP integration
      // This would use the charge_recurring tool from Max Pay MCP
      return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        token: `TOKEN-${Math.random().toString(36).substr(2, 9)}`,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Payment processed successfully via Max Pay'
      };
    };

    const paymentResult = await simulateMaxPayCall();

    if (!paymentResult.success) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Create order after successful payment
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      email,
      paymentToken: paymentResult.token,
      paymentStatus: 'completed',
      transactionId: paymentResult.transactionId,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    await addOrder(order);

    res.status(200).json({
      success: true,
      order,
      payment: paymentResult,
      message: 'Order created and payment processed'
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
