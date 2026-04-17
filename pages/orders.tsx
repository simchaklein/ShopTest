import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Orders.module.css';

interface Order {
  id: string;
  items: any[];
  total: number;
  email: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function Orders() {
  const router = useRouter();
  const { orderId } = router.query;
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [orderId, orders]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  return (
    <>
      <Head>
        <title>Order History - PetFood Store</title>
      </Head>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back to Shop</Link>
      </header>

      <main className={styles.main}>
        <h1>Order History</h1>

        {orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <p>No orders yet</p>
            <Link href="/" className={styles.shopButton}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.ordersContainer}>
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`${styles.orderItem} ${selectedOrder?.id === order.id ? styles.active : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className={styles.orderInfo}>
                    <p className={styles.orderId}>Order {order.id}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.orderPrice}>₪{order.total.toFixed(2)}</div>
                  <span className={`${styles.badge} ${styles[order.paymentStatus]}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              ))}
            </div>

            {selectedOrder && (
              <div className={styles.orderDetails}>
                <h2>Order Details</h2>
                <div className={styles.detail}>
                  <label>Order ID:</label>
                  <span>{selectedOrder.id}</span>
                </div>
                <div className={styles.detail}>
                  <label>Date:</label>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                <div className={styles.detail}>
                  <label>Email:</label>
                  <span>{selectedOrder.email}</span>
                </div>
                <div className={styles.detail}>
                  <label>Status:</label>
                  <span className={styles.statusBadge}>{selectedOrder.status}</span>
                </div>
                <div className={styles.detail}>
                  <label>Payment Status:</label>
                  <span className={`${styles.statusBadge} ${styles[selectedOrder.paymentStatus]}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                <h3>Items</h3>
                <div className={styles.itemsList}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <span>{item.emoji} {item.name} × {item.quantity}</span>
                      <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderTotal}>
                  <span>Total:</span>
                  <span>₪{selectedOrder.total.toFixed(2)}</span>
                </div>

                <Link href="/" className={styles.continueButton}>
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
