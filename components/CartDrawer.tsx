import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 50;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[150]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-[200] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
                <span className="bg-accent text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-muted group-hover:text-primary" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-6 bg-accent-light border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${progress >= 100 ? 'bg-secondary text-white' : 'bg-white text-secondary'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-primary">
                  {progress >= 100 
                    ? "You've unlocked free shipping! 🐾" 
                    : `Add ₪${(freeShippingThreshold - total).toFixed(2)} more for free shipping`}
                </p>
              </div>
              <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-secondary"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-6 opacity-20">🛒</div>
                  <h3 className="text-lg font-bold mb-2">Your cart is empty</h3>
                  <p className="text-muted text-sm mb-8">Looks like you haven't added anything yet.</p>
                  <button onClick={onClose} className="btn-primary w-full max-w-[200px]">
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-24 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-gray-50 flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm truncate pr-2 group-hover:text-secondary transition-colors">
                          {item.name}
                        </h4>
                        <p className="font-bold text-sm">₪{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-muted text-[10px] mb-4 uppercase tracking-widest font-bold">
                        ₪{item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full px-2 py-1 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="p-1 hover:text-secondary transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold leading-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-secondary transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-muted hover:text-red-500 transition-colors p-1"
                          title="Remove item"
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
              <div className="p-6 bg-white border-t border-gray-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Subtotal</span>
                    <span className="text-primary font-medium">₪{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Shipping</span>
                    <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">
                      {total >= freeShippingThreshold ? 'Calculated at checkout' : 'Free over ₪50'}
                    </span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold">₪{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full btn-primary block text-center py-4 bg-primary text-white rounded-2xl font-bold shadow-xl hover:bg-primary-muted transition-all active:scale-[0.98]"
                >
                  Checkout • ₪{total.toFixed(2)}
                </Link>
                <p className="text-[10px] text-center text-muted uppercase tracking-widest font-bold">
                  Secure Checkout with Max Pay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

