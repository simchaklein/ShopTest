import Head from 'next/head';
import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <main dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-6 text-right">
      <Head>
        <title>התשלום בוטל | ShopTest</title>
      </Head>
      <section className="max-w-xl w-full bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl">
        <p className="text-5xl mb-6" aria-hidden="true">×</p>
        <h1 className="text-3xl font-bold mb-4 text-primary">התשלום בוטל</h1>
        <p className="text-muted leading-8 mb-8">
          ביטלת את תהליך התשלום. ניתן לחזור ולהשלים את ההזמנה בכל שלב.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/checkout" className="btn-primary">חזרה לתשלום</Link>
          <Link href="/" className="btn-secondary">חזרה לחנות</Link>
        </div>
      </section>
    </main>
  );
}
