import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Search, User } from 'lucide-react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const updateCartCount = () => {
      const cart = localStorage.getItem('shoptest_cart');
      if (cart) {
        try {
          const parsed = JSON.parse(cart);
          const count = parsed.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
          setCartCount(count);
        } catch {
          setCartCount(0);
        }
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Announcement Bar */}
      <div className="bg-primary text-accent-light py-2 overflow-hidden border-b border-white/10">
        <div className="marquee-content gap-8">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest whitespace-nowrap">
              🐾 Free shipping on orders over $50 • Premium nutrition for your pets • Shop our new spring collection
            </span>
          ))}
        </div>
      </div>

      <header 
        className={`transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between">
            {/* Search - Desktop */}
            <div className="hidden md:flex items-center flex-1">
              <button className="p-2 hover:bg-accent rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span className="text-secondary">🐾</span>
              <span>Pet<span className="text-primary-muted font-light">Food</span></span>
            </Link>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-full transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </button>
              
              <Link href="/cart" className="relative p-2 md:p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:border-secondary transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Nav - Centered below logo for a more premium look */}
          <nav className="flex justify-center gap-8 mt-4">
            {['Shop All', 'Dogs', 'Cats', 'Treats', 'About Us'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Shop All' ? '/' : '#'} 
                className="text-sm font-medium text-primary/80 hover:text-secondary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}

