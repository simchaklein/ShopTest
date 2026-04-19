import Link from 'next/link';
import { Mail, Phone, Globe, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-6">
              <span className="text-secondary">🐾</span>
              <span>Pet<span className="text-primary-muted font-light">Food</span></span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-8 max-w-xs">
              Premium pet nutrition for your beloved companions. We believe in high-quality, organic ingredients for a healthier, happier life.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-accent-light rounded-full text-primary hover:bg-secondary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-accent-light rounded-full text-primary hover:bg-secondary hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-accent-light rounded-full text-primary hover:bg-secondary hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-secondary/20 inline-block pb-1">Shop</h4>
            <ul className="space-y-4 text-sm font-medium text-primary/70">
              <li><Link href="/" className="hover:text-secondary transition-colors">All Products</Link></li>
              <li><Link href="/" className="hover:text-secondary transition-colors">Best Sellers</Link></li>
              <li><Link href="/" className="hover:text-secondary transition-colors">Organic Dog Food</Link></li>
              <li><Link href="/" className="hover:text-secondary transition-colors">Cat Supplements</Link></li>
              <li><Link href="/" className="hover:text-secondary transition-colors">Natural treats</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-secondary/20 inline-block pb-1">Wellness</h4>
            <ul className="space-y-4 text-sm font-medium text-primary/70">
              <li><Link href="#" className="hover:text-secondary transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Nutrition Guide</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Vet-Approved Blog</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-secondary/20 inline-block pb-1">Newsletter</h4>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Join our community and get 15% off your first order!
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="yours@email.com"
                className="w-full px-5 py-3 bg-accent-light border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 text-sm font-medium" 
              />
              <button className="btn-primary w-full py-3.5 text-xs uppercase tracking-widest">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-bold text-muted uppercase tracking-widest">
            <p>&copy; 2024 PetFood Store</p>
            <span className="hidden md:block opacity-30">•</span>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payments via</span>
            <span className="text-xl font-bold">VISA</span>
            <span className="text-xl font-bold">MASTERCARD</span>
            <span className="text-xl font-bold italic">MaxPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

