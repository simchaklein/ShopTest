import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowRight,
  CreditCard,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

type Order = {
  id: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
  items: Array<{ quantity: number }>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminHome() {
  const { data: orders = [] } = useSWR<Order[]>('/api/orders', fetcher);
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingOrders = orders.filter((order) => order.paymentStatus === 'pending_payment').length;
  const itemCount = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0),
    0
  );

  return (
    <AdminLayout
      title="Overview"
      subtitle="Track store activity, incoming orders, and payment readiness."
    >
      <section className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total sales</span>
          <strong>₪{totalRevenue.toFixed(2)}</strong>
          <small>From created orders</small>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Orders</span>
          <strong>{orders.length}</strong>
          <small>{pendingOrders} waiting for payment</small>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Items sold</span>
          <strong>{itemCount}</strong>
          <small>Across all orders</small>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Payment mode</span>
          <strong>Sandbox</strong>
          <small>Hosted checkout pending</small>
        </div>
      </section>

      <section className={styles.twoColumn}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Incoming orders</h2>
              <p>Recent order activity from checkout.</p>
            </div>
            <Link href="/admin/orders" className={styles.textLink}>
              View all
              <ArrowRight className={styles.inlineIcon} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag className={styles.emptyIcon} />
              <strong>No orders yet</strong>
              <span>New checkout orders will appear here immediately.</span>
            </div>
          ) : (
            <div className={styles.orderPreviewList}>
              {orders.slice(0, 5).map((order) => (
                <Link href="/admin/orders" key={order.id} className={styles.orderPreviewItem}>
                  <span>
                    <strong>{order.id}</strong>
                    <small>{new Date(order.createdAt).toLocaleString()}</small>
                  </span>
                  <span>
                    <strong>₪{Number(order.total || 0).toFixed(2)}</strong>
                    <small>{order.paymentStatus}</small>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Store checklist</h2>
              <p>What matters before installing payment MCP.</p>
            </div>
          </div>

          <div className={styles.checklist}>
            <div className={styles.checkItem}>
              <PackageCheck className={styles.checkIcon} />
              <span>
                <strong>Checkout creates pending orders</strong>
                <small>Amounts are calculated on the server.</small>
              </span>
            </div>
            <div className={styles.checkItem}>
              <CreditCard className={styles.checkIcon} />
              <span>
                <strong>No card data collected locally</strong>
                <small>Ready for hosted payment handoff.</small>
              </span>
            </div>
            <div className={styles.checkItem}>
              <TrendingUp className={styles.checkIcon} />
              <span>
                <strong>Payment settings are visible</strong>
                <small>Sandbox terminal configuration can be reviewed.</small>
              </span>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
