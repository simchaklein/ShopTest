import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';

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
      {/* Premium Announcement Bar */}
      <div className="bg-secondary text-white py-2.5 overflow-hidden shadow-sm">
        <div className="marquee-content gap-12">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
              <span>★</span>
              FREE SHIPPING ON ORDERS OVER ₪50
              <span>★</span>
              CLEAN INGREDIENTS ONLY
              <span>★</span>
              JOIN THE REWARDS PROGRAM
            </span>
          ))}
        </div>
      </div>

      <header 
        className={`transition-all duration-500 ${
          scrolled ? 'bg-white/70 backdrop-blur-2xl py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent py-6'
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between gap-8">
            {/* Mobile Menu */}
            <button className="lg:hidden p-2 text-primary">
              <Menu className="w-6 h-6" />
            </button>

            {/* Nav - Left Side */}
            <nav className="hidden lg:flex items-center gap-10 flex-1">
              {['Shop All', 'Dogs', 'Cats'].map((item) => (
                <Link 
                  key={item} 
                  href="/" 
                  className="text-xs font-bold uppercase tracking-[0.1em] text-primary/80 hover:text-secondary transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Logo - Centered */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🐾</span>
              <div className="flex flex-col -gap-1">
                <span className="text-2xl font-bold tracking-tight uppercase leading-none">PetFood</span>
                <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-40">Boutique</span>
              </div>
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
              <nav className="hidden xl:flex items-center gap-10 mr-10">
                {['Our Story', 'Help'].map((item) => (
                  <Link 
                    key={item} 
                    href="/" 
                    className="text-xs font-bold uppercase tracking-[0.1em] text-primary/80 hover:text-secondary transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-1">
                <button className="p-3 hover:bg-white rounded-full transition-all text-primary/70 hover:text-secondary">
                  <Search className="w-5 h-5" />
                </button>
                <button className="hidden sm:flex p-3 hover:bg-white rounded-full transition-all text-primary/70 hover:text-secondary">
                  <User className="w-5 h-5" />
                </button>
                <Link href="/cart" className="group relative p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:border-secondary transition-all">
                  <ShoppingCart className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
