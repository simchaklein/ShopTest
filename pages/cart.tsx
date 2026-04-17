import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Cart.module.css';
import { getCartFromLocalStorage, saveCartToLocalStorage, removeFromCart, updateQuantity, clearCart } from '../lib/cart';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function Cart() {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number }>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartData = getCartFromLocalStorage();
    setCart(cartData);
    setLoading(false);
  }, []);

  const handleRemove = (itemId: string) => {
    const updatedCart = removeFromCart(cart, itemId);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const updatedCart = updateQuantity(cart, itemId, newQuantity);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const emptyCart = clearCart(cart);
      setCart(emptyCart);
      saveCartToLocalStorage(emptyCart);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading cart...</div>;
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - PetFood Store</title>
      </Head>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Continue Shopping</Link>
      </header>

      <main className={styles.main}>
        <h1>Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <Link href="/" className={styles.continueButton}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartContainer}>
              <div className={styles.itemsList}>
                {cart.items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>{item.emoji}</div>
                    <div className={styles.itemDetails}>
                      <h3>{item.name}</h3>
                      <p className={styles.itemPrice}>₪{item.price.toFixed(2)} each</p>
                    </div>
                    <div className={styles.itemQuantity}>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>−</button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      />
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className={styles.itemTotal}>
                      ₪{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemove(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <h2>Order Summary</h2>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>₪{cart.total.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>₪0.00 (Free)</span>
                </div>
                <div className={styles.summaryRow + ' ' + styles.total}>
                  <span>Total:</span>
                  <span>₪{cart.total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className={styles.checkoutButton}>
                  Proceed to Checkout
                </Link>
                <button 
                  className={styles.clearButton}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
