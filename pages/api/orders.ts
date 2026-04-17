import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrders, addOrder, getOrderById } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      if (req.query.id) {
        const order = await getOrderById(req.query.id as string);
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json(order);
      }

      const orders = await getOrders();
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const { items, total, email, paymentToken, paymentStatus } = req.body;

      if (!items || !total || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order = {
        id: `ORD-${Date.now()}`,
        items,
        total,
        email,
        paymentToken,
        paymentStatus: paymentStatus || 'pending',
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      await addOrder(order);
      return res.status(201).json(order);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
