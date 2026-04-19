import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Plus, Minus, ShieldCheck, Truck, Star } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCartStore } from '../../lib/store';

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
  specifications: {
    weight: string;
    servingSize: string;
    ingredients: string;
    benefits: string[];
  };
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      emoji: product.emoji
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!isMounted || loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-40">
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">🐾</div>
            <p className="text-muted text-lg font-medium">Preparing nutrition details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="text-6xl mb-6">🤌</div>
          <h2 className="text-2xl font-bold mb-4 text-primary">Product not found</h2>
          <Link href="/" className="btn-secondary">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Head>
        <title>{product.name} | PetFood Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <Header />

      <main className="pt-[180px] pb-20">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left: Visuals */}
            <div className="space-y-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted hover:text-secondary transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to all products
              </Link>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square bg-white rounded-[3rem] shadow-sm border border-gray-100 flex items-center justify-center text-[12rem] select-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                   animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, -2, 2, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="z-10"
                >
                  {product.emoji}
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-square bg-white rounded-3xl border border-gray-100 flex items-center justify-center text-4xl opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                    {product.emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <div className="mb-10 text-primary">
                <div className="flex items-center gap-3 mb-6">
                   <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                     {product.category}
                   </span>
                   <div className="flex items-center gap-1">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className="w-3 h-3 text-secondary fill-secondary" />
                     ))}
                     <span className="text-[10px] font-bold text-muted ml-2">48 REVIEWS</span>
                   </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {product.name}
                </h1>
                
                <p className="text-3xl font-medium mb-8">
                  ₪{product.price.toFixed(2)}
                </p>

                <p className="opacity-70 leading-relaxed mb-10 text-lg">
                  {product.description}
                </p>

                {/* Benefits Pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {product.specifications.benefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 bg-accent/30 px-4 py-2 rounded-full text-xs font-bold text-primary/80">
                      <Check className="w-3 h-3 text-secondary" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-10">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center gap-6 bg-accent-light rounded-2xl px-6 py-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-primary-muted hover:text-secondary transition-colors"
                    >
                      <Minus className="w-5 h-5 text-primary" />
                    </button>
                    <span className="text-lg font-bold w-4 text-center text-primary">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-primary-muted hover:text-secondary transition-colors"
                    >
                      <Plus className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 btn-primary py-5 rounded-2xl font-bold text-lg shadow-xl shadow-secondary/10 flex items-center justify-center gap-3 transition-all ${
                      added ? 'bg-secondary' : ''
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-6 h-6" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6" />
                        <span>Add to Cart • ₪{(product.price * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <Truck className="w-4 h-4" />
                    Free shipping over ₪50
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Safe & Organic Ingredients
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-6 text-primary">
                <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                  <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Weight</h5>
                  <p className="font-bold">{product.specifications.weight}</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                  <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Serving</h5>
                  <p className="font-bold">{product.specifications.servingSize}</p>
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
