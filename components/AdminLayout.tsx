import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BarChart3,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import styles from '../styles/Admin.module.css';

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

const navigation = [
  { href: '/admin', label: 'Home', icon: Home },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Payment settings', icon: CreditCard },
];

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter();

  return (
    <div className={styles.shell}>
      <Head>
        <title>{`${title} | ShopTest Admin`}</title>
      </Head>

      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand}>
          <span className={styles.brandMark}>S</span>
          <span>
            <strong>ShopTest</strong>
            <small>Commerce admin</small>
          </span>
        </Link>

        <nav className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon className={styles.navIcon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarCard}>
          <Package className={styles.sidebarCardIcon} />
          <p>Sandbox store</p>
          <span>Ready for payment MCP testing</span>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className={styles.statusPill}>
            <BarChart3 className={styles.statusIcon} />
            Live test store
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
