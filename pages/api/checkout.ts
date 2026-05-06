import type { NextApiRequest, NextApiResponse } from 'next';
import { addOrder, getProducts } from '../../lib/db';

type CheckoutItemInput = {
  id?: string | number;
  quantity?: number;
};

type Product = {
  id: string | number;
  name: string;
  price: number;
  emoji?: string;
};

function normalizeProducts(data: any): Product[] {
  const products = Array.isArray(data) ? data : data?.products;
  return Array.isArray(products) ? products : [];
}

function normalizeQuantity(quantity: unknown) {
  const parsed = Math.floor(Number(quantity));
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 99);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, email, fullName, phone, address, city, zip } = req.body;

    if (!Array.isArray(items) || items.length === 0 || !email || !fullName || !phone || !address || !city || !zip) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const products = normalizeProducts(await getProducts());

    if (products.length === 0) {
      return res.status(500).json({ error: 'Product catalog is unavailable' });
    }

    const orderItems = (items as CheckoutItemInput[]).map((item) => {
      const product = products.find((p) => String(p.id) === String(item.id));
      if (!product) return null;

      const quantity = normalizeQuantity(item.quantity);
      return {
        id: String(product.id),
        name: product.name,
        price: Number(product.price) || 0,
        quantity,
        emoji: product.emoji || '',
      };
    });

    if (orderItems.some((item) => item === null)) {
      return res.status(400).json({ error: 'Cart contains unavailable products' });
    }

    const safeOrderItems = orderItems.filter(Boolean) as Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      emoji: string;
    }>;

    const subtotal = safeOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 15;
    const total = Number((subtotal + shipping).toFixed(2));

    const order = {
      id: `ORD-${Date.now()}`,
      type: 'one_time',
      items: safeOrderItems,
      customer: {
        email,
        fullName,
        phone,
      },
      shippingAddress: {
        address,
        city,
        zip,
      },
      email,
      subtotal: Number(subtotal.toFixed(2)),
      shipping,
      total,
      currency: 'ILS',
      paymentStatus: 'pending_payment',
      paymentProvider: 'pending',
      createdAt: new Date().toISOString(),
      status: 'awaiting_payment'
    };

    await addOrder(order);

    res.status(200).json({
      success: true,
      order,
      message: 'Order created and ready for hosted payment'
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
