import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, Truck, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen">
      <Head>
        <title>PetFood Boutique | Premium Nutrition for Happy Paws</title>
        <meta name="description" content="Shop premium organic pet food and boutique pet care products." />
      </Head>

      <Header />

      <main className="pt-[160px]">
        {/* Luxury Hero Section */}
        <section className="container-max mb-24 px-4 md:px-0">
          <div className="relative overflow-hidden bg-white rounded-[4rem] card-shadow border border-gray-100 min-h-[650px] flex flex-col lg:flex-row items-center">
            
            {/* Left Content */}
            <div className="flex-1 p-10 md:p-20 z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-8">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">New Spring Collection</span>
                </div>
                
                <h1 className="h1 text-primary mb-8 leading-[1.05]">
                  Give them the <br /> 
                  <span className="relative inline-block">
                    best life
                    <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-1.5 bg-secondary/30 rounded-full" />
                  </span>
                  {' '}they deserve.
                </h1>
                
                <p className="text-lg text-primary-muted mb-12 max-w-md leading-relaxed">
                  Boutique nutrition crafted with human-grade ingredients. Because family deserves the finest.
                </p>
                
                <div className="flex flex-wrap gap-5">
                  <button className="btn-primary flex items-center gap-2 group">
                    Shop Full Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="btn-secondary">Meet Our Vets</button>
                </div>

                <div className="mt-16 flex items-center gap-6">
                  <div className="flex -space-x-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-accent flex items-center justify-center text-xl shadow-sm">
                        {['🐶', '🐱', '🐹', '🐰'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}
                    </div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">10k+ Happy Families</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Visual Area */}
            <div className="flex-1 w-full h-full min-h-[400px] lg:min-h-[650px] relative bg-accent overflow-hidden group">
               <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[15rem] md:text-[25rem] select-none filter drop-shadow-2xl"
                  >
                    🐕
                  </motion.div>
               </div>
               
               {/* Decorators */}
               <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
               <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary/10 blur-3xl rounded-full" />
               
               <div className="absolute bottom-10 left-10 right-10 p-6 glass rounded-3xl flex items-center gap-4 border-white/40">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm text-primary">✨</div>
                  <div className="text-primary">
                    <p className="text-xs font-bold">Monthly Special</p>
                    <p className="text-[10px] opacity-70 font-medium">Get 20% off your first subscription</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="container-max mb-24 overflow-x-auto">
          <div className="flex items-center justify-center gap-6 min-w-max pb-4 px-4 md:px-0">
            {['All Products', 'Puppy Care', 'Adult Meals', 'Senior Health', 'Grooming', 'Supplements'].map((cat) => (
              <button key={cat} className="px-8 py-3 bg-white border border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-primary hover:border-secondary hover:text-secondary transition-all shadow-sm active:scale-95">
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Main Product Grid */}
        <section className="container-max mb-32 px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="max-w-2xl">
              <h2 className="h2 text-primary mb-5">Curated Essentials</h2>
              <p className="text-lg text-primary-muted font-medium">Each product is tested and approved by our board-certified veterinary nutritionists.</p>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-secondary transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dog food, treats..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-full focus:outline-none focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all text-sm font-medium shadow-sm text-primary"
              />
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-white rounded-[3.5rem] mb-6" />
                  <div className="h-6 bg-white rounded-full w-2/3 mb-3" />
                  <div className="h-4 bg-white rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
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
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border border-gray-100 italic">
                  <div className="text-7xl mb-8">🔎</div>
                  <h3 className="h3 mb-3 text-primary">No treasures found</h3>
                  <p className="text-muted text-lg">Try a different search term or category.</p>
                  <button onClick={() => setSearchTerm('')} className="mt-8 btn-secondary">
                    View All Products
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Trust Section */}
        <section className="bg-primary text-white py-24 mb-32 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
              <div className="text-[60rem]">🐾</div>
           </div>
           
           <div className="container-max relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
              <div className="text-center">
                 <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Truck className="w-8 h-8 text-white" />
                 </div>
                 <h4 className="text-xl font-bold mb-4">Express Wellness</h4>
                 <p className="text-white/60 text-sm leading-relaxed max-w-[250px] mx-auto">Speedy, carbon-neutral delivery to your doorstep within 48 hours.</p>
              </div>
              <div className="text-center">
                 <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <ShieldCheck className="w-8 h-8 text-white" />
                 </div>
                 <h4 className="text-xl font-bold mb-4">Tested & True</h4>
                 <p className="text-white/60 text-sm leading-relaxed max-w-[250px] mx-auto">Every batch laboratory tested for purity and nutritional density.</p>
              </div>
              <div className="text-center">
                 <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Heart className="w-8 h-8 text-white" />
                 </div>
                 <h4 className="text-xl font-bold mb-4">Paws for Cause</h4>
                 <p className="text-white/60 text-sm leading-relaxed max-w-[250px] mx-auto">1% of every sale goes to no-kill shelters across the country.</p>
              </div>
           </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="container-max mb-32">
           <div className="bg-accent rounded-[4rem] p-10 md:p-20 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="h2 text-primary mb-6">Join the PetFood Family</h2>
                <p className="text-primary-muted text-lg mb-12 max-w-xl mx-auto">Get 15% off your first order and exclusive access to monthly pet care journals.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                   <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full px-8 py-5 rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all text-primary"
                   />
                   <button className="btn-primary whitespace-nowrap">Join Now</button>
                </div>
              </div>
              <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/40 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
