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
    const products = await getProducts();
    
    if (!products) {
      return res.status(500).json({ error: 'Failed to load products' });
    }

    const { id } = req.query;
    
    if (id) {
      const product = products.find((p: any) => p.id === id);
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
