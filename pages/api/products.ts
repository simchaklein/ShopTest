import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await getProducts();

    if (!data) {
      return res.status(500).json({ error: 'Failed to load products' });
    }

    // Extract products array from the data object
    const products = Array.isArray(data) ? data : (data.products || []);

    if (!Array.isArray(products)) {
      return res.status(500).json({ error: 'Invalid product data format' });
    }

    const { id } = req.query;

    if (id) {
      const product = products.find((p: any) => p.id === String(id) || p.id === Number(id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
