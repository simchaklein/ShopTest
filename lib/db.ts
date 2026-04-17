import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function readJSON(filename: string) {
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

export async function writeJSON(filename: string, data: any) {
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
