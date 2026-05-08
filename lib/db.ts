import fs from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOB_PREFIX = process.env.SHOPTEST_DB_PREFIX || 'shoptest-db';

function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function blobPath(filename: string) {
  return `${BLOB_PREFIX}/${filename}`;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function readLocalJSON(filename: string) {
  try {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return null;
    }
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

async function writeLocalJSON(filename: string, data: any) {
  try {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

async function readBlobJSON(filename: string) {
  try {
    const response = await get(blobPath(filename), { access: 'public' });

    if (!response || response.statusCode !== 200 || !response.stream) {
      return null;
    }

    const text = await new Response(response.stream).text();
    return JSON.parse(text);
  } catch (error: any) {
    if (error?.name === 'BlobNotFoundError' || error?.message?.includes('not found')) {
      return null;
    }

    console.error(`Error reading blob ${filename}:`, error);
    return null;
  }
}

async function writeBlobJSON(filename: string, data: any) {
  try {
    await put(blobPath(filename), JSON.stringify(data, null, 2), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
    });

    return true;
  } catch (error) {
    console.error(`Error writing blob ${filename}:`, error);
    return false;
  }
}

export async function readJSON(filename: string) {
  if (hasBlobStore()) {
    const blobData = await readBlobJSON(filename);
    if (blobData !== null) return blobData;
  }

  return readLocalJSON(filename);
}

export async function writeJSON(filename: string, data: any) {
  if (hasBlobStore()) {
    return writeBlobJSON(filename, data);
  }

  return writeLocalJSON(filename, data);
}

export async function getProducts() {
  return readJSON('products.json');
}

export async function getOrders() {
  const orders = await readJSON('orders.json');
  return orders || [];
}

export async function addOrder(order: any) {
  const orders = await getOrders();
  orders.push(order);
  await writeJSON('orders.json', orders);
  return order;
}

export async function getOrderById(orderId: string) {
  const orders = await getOrders();
  return orders.find((o: any) => o.id === orderId);
}

export async function updateOrderById(orderId: string, updates: Record<string, any>) {
  const orders = await getOrders();
  const index = orders.findIndex((order: any) => order.id === orderId);

  if (index === -1) {
    return null;
  }

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeJSON('orders.json', orders);
  return orders[index];
}
