import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    const cart = localStorage.getItem('shoptest_cart');
    if (cart) {
      try {
        const parsed = JSON.parse(cart);
        const count = parsed.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>PetFood Store - Premium Pet Nutrition</title>
        <meta name="description" content="Shop premium pet food and supplements" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🐾 PetFood Store</h1>
          <Link href="/cart" className={styles.cartLink}>
            🛒 Cart {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>Loading products...</div>
        ) : (
          <>
            <p className={styles.resultCount}>
              {filteredProducts.length} products found
            </p>
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className={styles.productCard}>
                    <div className={styles.productImage}>{product.emoji}</div>
                    <h2>{product.name}</h2>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.description}>{product.description.substring(0, 80)}...</p>
                    <div className={styles.productFooter}>
                      <span className={styles.price}>₪{product.price.toFixed(2)}</span>
                      <span className={styles.viewDetails}>View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 PetFood Store. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <Link href="/orders">Order History</Link>
          <span>•</span>
          <span>Contact: support@petfood.test</span>
        </div>
      </footer>
    </>
  );
}
