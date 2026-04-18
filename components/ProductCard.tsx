import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
}

export default function ProductCard({
  id,
  name,
  price,
  emoji,
  category,
  description,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    const cart = localStorage.getItem('shoptest_cart');
    let cartData = cart ? JSON.parse(cart) : { items: [] };

    const existingItem = cartData.items.find((item: any) => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartData.items.push({ id, name, price, emoji, quantity: 1 });
    }

    localStorage.setItem('shoptest_cart', JSON.stringify(cartData));
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full bg-white p-4 rounded-[3.5rem] card-shadow border border-gray-50 transition-all duration-500 hover:-translate-y-2"
    >
      <Link href={`/product/${id}`} className="relative flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square bg-accent rounded-[3rem] overflow-hidden mb-6 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              rotate: isHovered ? [0, -3, 3, 0] : 0 
            }}
            transition={{ duration: 0.6 }}
            className="text-[7rem] select-none"
          >
            {emoji}
          </motion.div>

          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center p-6"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full py-4 shadow-2xl rounded-2xl font-bold flex items-center justify-center gap-2 transform transition-all active:scale-95 ${
                    isAdding ? 'bg-secondary text-white' : 'bg-white text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Tag */}
          {price > 60 && (
            <div className="absolute top-4 left-4 bg-secondary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Must Have
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-3 mb-2">
              <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors leading-tight">
                {name}
              </h3>
              <div className="font-bold text-lg text-primary">
                ₪{price.toFixed(2)}
              </div>
            </div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block">
              {category}
            </span>
          </div>
          
          <p className="text-muted text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
