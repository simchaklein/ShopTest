import {
  CheckCircle2,
  CreditCard,
  KeyRound,
  Lock,
  PlugZap,
  ShieldCheck,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

export default function AdminSettings() {
  return (
    <AdminLayout
      title="Payment settings"
      subtitle="Configure how ShopTest will hand orders to a payment provider."
    >
      <section className={styles.settingsGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Payment provider</h2>
              <p>Sandbox configuration for MCP installation testing.</p>
            </div>
            <span className={styles.readyBadge}>Ready for MCP</span>
          </div>

          <div className={styles.settingRows}>
            <div className={styles.settingRow}>
              <span>
                <CreditCard className={styles.settingIcon} />
                Provider
              </span>
              <strong>Pending hosted checkout</strong>
            </div>
            <div className={styles.settingRow}>
              <span>
                <PlugZap className={styles.settingIcon} />
                Integration target
              </span>
              <strong>Max Pay MCP / Stripe-style redirect</strong>
            </div>
            <div className={styles.settingRow}>
              <span>
                <ShieldCheck className={styles.settingIcon} />
                Environment
              </span>
              <strong>Sandbox terminal only</strong>
            </div>
            <div className={styles.settingRow}>
              <span>
                <Lock className={styles.settingIcon} />
                Card data
              </span>
              <strong>Not collected by ShopTest</strong>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Security baseline</h2>
              <p>Minimum requirements before turning payments on.</p>
            </div>
          </div>

          <div className={styles.checklist}>
            <div className={styles.checkItem}>
              <CheckCircle2 className={styles.checkIcon} />
              <span>
                <strong>Server-side totals</strong>
                <small>Checkout recalculates item prices and shipping.</small>
              </span>
            </div>
            <div className={styles.checkItem}>
              <CheckCircle2 className={styles.checkIcon} />
              <span>
                <strong>Pending order state</strong>
                <small>Orders are not marked paid before provider confirmation.</small>
              </span>
            </div>
            <div className={styles.checkItem}>
              <KeyRound className={styles.checkIcon} />
              <span>
                <strong>Secrets stay outside Git</strong>
                <small>Terminal credentials belong in deployment environment variables.</small>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.panelWide}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Expected payment flow</h2>
              <p>How the admin expects checkout to behave after MCP installation.</p>
            </div>
          </div>

          <div className={styles.flowGrid}>
            <div>Order created</div>
            <div>Redirect to hosted payment</div>
            <div>Provider confirms payment</div>
            <div>Order becomes paid</div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
