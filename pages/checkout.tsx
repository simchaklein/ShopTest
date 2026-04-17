import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Checkout.module.css';
import { getCartFromLocalStorage } from '../lib/cart';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<{ items: CartItem[]; total: number }>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: ''
  });

  useEffect(() => {
    const cartData = getCartFromLocalStorage();
    if (cartData.items.length === 0) {
      router.push('/cart');
    }
    setCart(cartData);
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Call checkout API which simulates Max Pay MCP integration
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          total: cart.total,
          email: formData.email,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Clear cart and redirect to order confirmation
      localStorage.removeItem('shoptest_cart');
      router.push(`/orders?orderId=${data.order.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading checkout...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your cart is empty</p>
        <Link href="/">Return to Shop</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - PetFood Store</title>
      </Head>

      <header className={styles.header}>
        <Link href="/cart" className={styles.backLink}>← Back to Cart</Link>
      </header>

      <main className={styles.main}>
        <h1>Checkout</h1>

        <div className={styles.checkoutContainer}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>Billing Information</legend>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend>Payment Information</legend>
                <div className={styles.formGroup}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </fieldset>

              {error && <div className={styles.error}>{error}</div>}

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>

          <div className={styles.summarySection}>
            <h2>Order Summary</h2>
            <div className={styles.itemsList}>
              {cart.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.emoji} {item.name} × {item.quantity}</span>
                  <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.total}>
              <span>Total:</span>
              <span>₪{cart.total.toFixed(2)}</span>
            </div>
            <p className={styles.note}>
              💳 Payments are processed through Max Pay MCP in sandbox mode
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
