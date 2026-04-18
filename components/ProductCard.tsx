import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Plus } from 'lucide-react';
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

    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full"
    >
      <Link href={`/product/${id}`} className="relative flex-1">
        <div className="relative aspect-[4/5] bg-accent-light rounded-3xl overflow-hidden mb-4 transition-all duration-500 group-hover:rounded-[2.5rem]">
          {/* Product Image/Emoji */}
          <div className="w-full h-full flex items-center justify-center text-8xl select-none">
            <motion.div
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0 
              }}
              transition={{ duration: 0.5 }}
            >
              {emoji}
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
              {category}
            </div>
            {price > 50 && (
              <div className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                Bestseller
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-primary/40'
              }`}
            />
          </button>

          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full py-3.5 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isAdding ? 'bg-secondary' : 'hover:bg-primary-muted'
                  }`}
                >
                  {isAdding ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span>✨ Added!</span>
                    </motion.div>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-2">
          <div className="flex justify-between items-start gap-4 mb-1">
            <h3 className="font-display font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
              {name}
            </h3>
            <div className="font-display font-medium text-primary-muted whitespace-nowrap">
              ₪{price.toFixed(2)}
            </div>
          </div>
          <p className="text-muted text-xs line-clamp-2 font-medium">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

