import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartFromStorage();
    window.addEventListener('cartUpdated', loadCartFromStorage);
    return () => window.removeEventListener('cartUpdated', loadCartFromStorage);
  }, []);

  const loadCartFromStorage = () => {
    try {
      const cart = localStorage.getItem('shoptest_cart');
      if (cart) {
        const parsed = JSON.parse(cart);
        setCartItems(parsed.items || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    let updatedItems;
    if (quantity <= 0) {
      updatedItems = cartItems.filter(item => item.id !== id);
    } else {
      updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    }
    setCartItems(updatedItems);
    localStorage.setItem('shoptest_cart', JSON.stringify({ items: updatedItems }));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('shoptest_cart', JSON.stringify({ items: updatedItems }));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setCartItems([]);
      localStorage.setItem('shoptest_cart', JSON.stringify({ items: [] }));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">🐾</div>
            <p className="text-gray-600 text-lg">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - PetFood Store</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-max">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-10 h-10 text-primary" />
              Shopping Cart
            </h1>
          </motion.div>

          {cartItems.length === 0 ? (
            // Empty Cart State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-12 text-center"
            >
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 text-lg mb-8">
                Start shopping and add some premium pet products to your cart!
              </p>
              <Link
                href="/"
                className="inline-block bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-6 flex gap-6 items-center ${
                          index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        {/* Product Emoji */}
                        <div className="flex-shrink-0 bg-primary/10 rounded-lg p-4 text-4xl">
                          {item.emoji}
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-primary font-semibold">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </motion.button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            }
                            className="w-12 text-center border-0 py-2 font-semibold focus:ring-0"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-2xl font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Clear Cart Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearCart}
                  className="mt-6 w-full py-3 px-6 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </motion.button>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold gradient-text">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/checkout"
                      className="block w-full bg-primary hover:bg-secondary text-white py-4 px-6 rounded-lg font-semibold text-center text-lg transition-colors"
                    >
                      Proceed to Checkout
                    </Link>
                  </motion.div>

                  <Link
                    href="/"
                    className="block w-full mt-4 py-3 px-6 border-2 border-primary text-primary rounded-lg font-semibold text-center hover:bg-primary/5 transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  {/* Cart Summary */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-gray-900">
                        {cartItems.length}
                      </span>{' '}
                      {cartItems.length === 1 ? 'item' : 'items'} in cart
                    </p>
                    <p className="text-sm text-gray-600">
                      Estimated delivery in 2-3 business days
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
