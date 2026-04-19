import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartStore } from '../lib/store';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 15;
  const total = subtotal + shipping;

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire boutique cart?')) {
      clearCart();
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="pt-40 flex justify-center">
           <div className="animate-bounce text-4xl">🐾</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="pt-[200px] pb-32">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left: Items */}
            <div className="flex-[2]">
              <div className="flex items-center justify-between mb-12">
                <h1 className="h2 text-primary">Your Selection</h1>
                {items.length > 0 && (
                  <button onClick={handleClearCart} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-red-500 transition-colors">
                    Clear Cart
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                  <div className="text-8xl mb-8">🛒</div>
                  <h3 className="h3 mb-4 text-primary">Your cart is empty</h3>
                  <p className="text-muted mb-10 max-w-xs mx-auto">Discover our premium selection and give your pet the best.</p>
                  <Link href="/" className="btn-primary inline-block">
                    Explore Boutique
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-8 border border-gray-50 shadow-sm group"
                    >
                      <div className="w-32 h-32 bg-accent rounded-3xl flex items-center justify-center text-6xl flex-shrink-0 group-hover:scale-105 transition-transform">
                        {item.emoji}
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-primary mb-2">{item.name}</h4>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Premium Pack</p>
                        
                        <div className="flex items-center justify-center sm:justify-start gap-6 bg-accent-light px-6 py-3 rounded-full w-max mx-auto sm:mx-0">
                          <button onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))} className="hover:text-secondary group-hover:scale-110 transition-transform text-primary">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-4 text-center text-primary">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-secondary group-hover:scale-110 transition-transform text-primary">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center sm:items-end gap-3 text-primary">
                        <div className="text-xl font-bold">₪{(item.price * item.quantity).toFixed(2)}</div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <Link href="/" className="inline-flex items-center gap-3 mt-12 text-sm font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Continue Discovering
              </Link>
            </div>

            {/* Right: Summary */}
            <div className="flex-1 lg:max-w-md">
              <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-primary/5 sticky top-[220px]">
                <h3 className="h3 mb-8 text-primary">Summary</h3>
                
                <div className="space-y-5 mb-10 pb-10 border-b border-gray-50">
                  <div className="flex justify-between text-muted text-sm font-medium">
                    <span>Selection Subtotal</span>
                    <span className="text-primary font-bold">₪{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted text-sm font-medium">
                    <span>Boutique Shipping</span>
                    <span className={shipping === 0 ? "text-secondary font-bold uppercase tracking-widest text-[10px]" : "text-primary font-bold"}>
                      {shipping === 0 ? 'Complimentary' : `₪${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                     <div className="bg-accent/50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-primary leading-relaxed">
                           Add ₪{(50 - subtotal).toFixed(2)} more to your selection to enjoy complimentary shipping.
                        </p>
                     </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-10 text-primary">
                  <span className="text-xl font-bold">Total Reserve</span>
                  <span className="text-3xl font-black">₪{total.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="btn-primary w-full block text-center mb-8">
                  Check Out
                </Link>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Secure Transaction Guaranteed
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <Truck className="w-4 h-4 text-secondary" />
                    Full Tracking via Boutique Express
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
