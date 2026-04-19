import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Gift } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../lib/store';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 50;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-primary/30 backdrop-blur-md z-[150]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background z-[200] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-white">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-3 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-primary">Your Cart</h2>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{itemCount} Premium Items</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-3 hover:bg-accent rounded-full transition-all group"
              >
                <X className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Premium Shipping Goal */}
            <div className="p-8 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${progress >= 100 ? 'bg-secondary text-white' : 'bg-accent text-secondary'}`}>
                    {progress >= 100 ? <Gift className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {progress >= 100 ? "You've unlocked FREE EXPRESS shipping!" : `You're ₪${(freeShippingThreshold - total).toFixed(2)} away from free shipping`}
                  </span>
                </div>
                <span className="text-xs font-bold text-muted uppercase tracking-widest">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-secondary shadow-[0_0_10px_rgba(232,125,13,0.3)]"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-[10rem] mb-10 opacity-10">🐾</div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Your cart is empty</h3>
                  <p className="text-muted text-sm max-w-[250px] mx-auto leading-relaxed mb-10">Quality nutrition starts with the first item in your cart.</p>
                  <button onClick={closeCart} className="btn-primary w-full max-w-xs">
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-24 h-32 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-sm border border-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-base tracking-tight leading-tight group-hover:text-secondary transition-colors text-primary">
                            {item.name}
                          </h4>
                          <p className="font-bold text-base text-primary">₪{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-loose">
                           ₪{item.price.toFixed(2)} / item
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-accent rounded-full px-4 py-2 border border-primary/5">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="p-1 hover:text-secondary text-primary"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-secondary text-primary"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="text-primary font-bold text-lg">₪{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                    <span className="text-secondary font-black tracking-widest text-[10px]">
                      {total >= freeShippingThreshold ? 'FREE EXPRESS' : '₪15.00'}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">Estimated Total</span>
                    <span className="text-3xl font-black text-primary">₪{(total >= freeShippingThreshold ? total : total + 15).toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full btn-primary flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Proceed to Checkout
                </Link>
                
                <p className="text-[9px] text-center text-muted uppercase tracking-[0.2em] font-black mt-6">
                   Secure Boutique Payments • 100% Guaranteed Paws
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
