import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, Truck, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchProducts();
    loadCartFromStorage();

    const handleCartUpdate = () => {
      loadCartFromStorage();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    try {
      const cart = localStorage.getItem('shoptest_cart');
      if (cart) {
        const parsed = JSON.parse(cart);
        setCartItems(parsed.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen">
      <Head>
        <title>PetFood | Premium Nutrition for Your Best Friend</title>
        <meta name="description" content="Shop premium pet food, supplements, and treats for your beloved pets" />
      </Head>

      <Header />

      <CartDrawer
        isOpen={cartIsOpen}
        onClose={() => setCartIsOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
      />

      <main className="pt-[140px]">
        {/* Hero Section */}
        <section className="container-max mb-20">
          <div className="relative overflow-hidden bg-accent rounded-[3rem] p-8 md:p-20 min-h-[500px] flex items-center">
            <div className="relative z-10 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Rated #1 in Pet Nutrition</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-primary leading-[1.1] mb-8">
                  Premium food for <span className="text-secondary italic">happy</span> paws.
                </h1>
                <p className="text-lg text-primary-muted mb-10 max-w-lg leading-relaxed">
                  We believe every pet deserves the finest ingredients. Shop our curated selection of organic, nutrient-rich meals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="btn-secondary">Learn Our Story</button>
                </div>
              </motion.div>
            </div>

            {/* Abstract Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:flex items-center justify-center opacity-20">
              <div className="text-[25rem] select-none">🐾</div>
            </div>
            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute left-[10%] bottom-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="bg-white border-y border-gray-100 py-10 mb-20">
          <div className="container-max grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Free Delivery</h4>
                <p className="text-xs text-muted">On all orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Safe & Natural</h4>
                <p className="text-xs text-muted">100% organic ingredients</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Premium Quality</h4>
                <p className="text-xs text-muted">Vet-approved nutrition</p>
              </div>
            </div>
          </div>
        </section>

        {/* Home Products Section */}
        <section className="container-max pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold mb-4">Shop Best Sellers</h2>
              <p className="text-muted">Our most loved meals and treats, crafted with care for your pet's health.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dog food..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-100 rounded-3xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      emoji={product.emoji}
                      category={product.category}
                      description={product.description}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold mb-2">No products found</h3>
                  <p className="text-muted italic">"Try searching for something else, like 'dog food' or 'cat food'"</p>
                  <button onClick={() => setSearchTerm('')} className="mt-8 text-secondary font-bold underline">
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

