import useSWR from 'swr';
import { AlertCircle, Search, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

type Order = {
  id: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  currency?: string;
  paymentStatus: string;
  status: string;
  paymentProvider?: string;
  createdAt: string;
  customer?: {
    email?: string;
    fullName?: string;
    phone?: string;
  };
  email?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    emoji?: string;
  }>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useSWR<Order[]>('/api/orders', fetcher);

  return (
    <AdminLayout
      title="Orders"
      subtitle="Review incoming checkout orders and payment state."
    >
      <section className={styles.panel}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input aria-label="Search orders" placeholder="Search orders" />
          </div>
          <button className={styles.secondaryButton} type="button">
            Export
          </button>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingBag className={styles.emptyIcon} />
            <strong>No orders yet</strong>
            <span>When a customer completes checkout, the order appears here.</span>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                        <small>{order.status}</small>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <strong>{order.customer?.fullName || 'Guest customer'}</strong>
                        <small>{order.customer?.email || order.email || 'No email'}</small>
                      </td>
                      <td>{itemCount}</td>
                      <td>
                        <span className={styles.paymentBadge}>{order.paymentStatus}</span>
                        {order.paymentStatus === 'pending_payment' && (
                          <small className={styles.warningLine}>
                            <AlertCircle className={styles.warningIcon} />
                            Waiting for provider
                          </small>
                        )}
                      </td>
                      <td>
                        <strong>₪{Number(order.total || 0).toFixed(2)}</strong>
                        <small>{order.currency || 'ILS'}</small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
