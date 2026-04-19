import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight, ShoppingBag, ShieldCheck, Truck, ChevronLeft, CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '../lib/store';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setError('');
    setProcessing(true);

    try {
      // Simulate API call to Max Pay MCP integration
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          email: formData.email,
          fullName: formData.fullName,
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Success flow
      clearCart();
      router.push(`/orders?orderId=${data.order.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setProcessing(false);
    }
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl mb-8">🛒</div>
        <h2 className="text-3xl font-bold mb-4 text-primary">Your cart is empty</h2>
        <p className="text-muted mb-10 max-w-xs mx-auto">Add some premium pet nutrition before checking out.</p>
        <Link href="/" className="btn-primary">Return to Boutique</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-primary">
      <Head>
        <title>Checkout | PetFood Boutique</title>
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left: Information & Forms (60%) */}
        <div className="flex-[1.5] bg-white p-6 md:p-12 lg:p-20">
          <div className="max-w-2xl ml-auto w-full">
            {/* Header / Logo */}
            <div className="mb-12">
               <Link href="/" className="flex items-center gap-2 mb-8 group w-max">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🐾</span>
                <div className="flex flex-col -gap-1">
                  <span className="text-2xl font-bold tracking-tight uppercase leading-none">PetFood</span>
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-40">Boutique</span>
                </div>
              </Link>

              {/* Breadcrumbs */}
              <nav className="flex items-center gap-3 text-xs font-medium text-muted mb-10">
                <Link href="/cart" className="text-secondary hover:underline">Cart</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-bold">Information</span>
                <ChevronRight className="w-3 h-3" />
                <span>Shipping</span>
                <ChevronRight className="w-3 h-3" />
                <span>Payment</span>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Contact Section */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-xl font-bold">Contact</h2>
                  <Link href="/" className="text-xs text-secondary hover:underline font-medium underline-offset-4 pointer-events-none opacity-50">Log in</Link>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </section>

              {/* Shipping Section */}
              <section>
                <h2 className="text-xl font-bold mb-6">Shipping address</h2>
                <div className="space-y-4">
                   <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="Zip Code"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>
              </section>

              {/* Payment Section */}
              <section className="bg-accent/30 p-8 rounded-3xl border border-secondary/10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold">Payment</h2>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">All transactions are secure and encrypted.</p>
                  </div>
                  <Lock className="w-5 h-5 text-secondary" />
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all pr-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM / YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              </section>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:flex-1 btn-primary py-6 rounded-2xl text-xl shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {processing ? (
                    'Processing Payment...'
                  ) : (
                    <>
                      Pay Now • ₪{total.toFixed(2)}
                    </>
                  )}
                </button>
                <Link href="/cart" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-primary transition-all">
                  <ChevronLeft className="w-4 h-4" />
                  Return to Cart
                </Link>
              </div>
            </form>
            
            <footer className="mt-20 pt-8 border-t border-gray-100 flex flex-wrap gap-8">
               <span className="text-[10px] font-bold text-muted uppercase tracking-widest cursor-pointer hover:text-primary transition-all">Refund policy</span>
               <span className="text-[10px] font-bold text-muted uppercase tracking-widest cursor-pointer hover:text-primary transition-all">Shipping policy</span>
               <span className="text-[10px] font-bold text-muted uppercase tracking-widest cursor-pointer hover:text-primary transition-all">Privacy policy</span>
            </footer>
          </div>
        </div>

        {/* Right: Order Summary (40%) */}
        <div className="flex-1 bg-accent-light p-6 md:p-12 lg:p-20 border-l border-gray-100 min-h-screen">
          <div className="max-w-md mr-auto w-full sticky top-12">
            <h2 className="text-xl font-bold mb-10 lg:hidden">Order Summary</h2>
            
            <div className="space-y-8 mb-12 overflow-y-auto max-h-[40vh] pr-4 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <div className="relative">
                    <div className="w-16 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-gray-100">
                      {item.emoji}
                    </div>
                    <span className="absolute -top-2 -right-2 bg-muted text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-accent-light">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight">{item.name}</p>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Premium Selection</p>
                  </div>
                  <p className="font-bold text-sm">₪{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-muted font-medium">Subtotal</span>
                <span className="font-bold">₪{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted font-medium">Shipping</span>
                <span className={shipping === 0 ? "text-secondary font-bold uppercase tracking-widest text-[10px]" : "font-bold"}>
                  {shipping === 0 ? 'Complimentary' : `₪${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center text-primary">
                <span className="text-xl font-bold">Total Reserve</span>
                <div className="text-right">
                  <span className="text-xs text-muted font-medium mr-3">ILS</span>
                  <span className="text-3xl font-black">₪{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-6">
               <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-50">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-secondary">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Express Shipping</p>
                    <p className="text-[10px] text-muted font-medium">Expected delivery within 48 hours</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-50">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Boutique Guarantee</p>
                    <p className="text-[10px] text-muted font-medium">100% human-grade quality assured</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
