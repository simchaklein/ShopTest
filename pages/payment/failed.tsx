import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PaymentFailed() {
  const router = useRouter();
  const message = typeof router.query.message === 'string' ? router.query.message.slice(0, 160) : '';

  return (
    <main dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-6 text-right">
      <Head>
        <title>התשלום לא הושלם | ShopTest</title>
      </Head>
      <section className="max-w-xl w-full bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl">
        <p className="text-5xl mb-6" aria-hidden="true">!</p>
        <h1 className="text-3xl font-bold mb-4 text-primary">התשלום לא הושלם</h1>
        <p className="text-muted leading-8 mb-6">
          נראה שהתשלום לא עבר או שהתקבלה שגיאה בתהליך.
        </p>
        {message && (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mb-6 text-sm text-amber-900">
            הודעה בטוחה: {message}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/checkout" className="btn-primary">נסה שוב</Link>
          <Link href="/" className="btn-secondary">חזרה לחנות</Link>
        </div>
      </section>
    </main>
  );
}
