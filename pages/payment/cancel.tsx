import Head from 'next/head';
import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <Head>
        <title>Payment Cancelled | ShopTest</title>
      </Head>
      <section className="max-w-lg bg-white border border-gray-100 rounded-3xl p-10 shadow-xl">
        <p className="text-6xl mb-6">×</p>
        <h1 className="text-3xl font-bold mb-4 text-primary">Payment cancelled</h1>
        <p className="text-muted mb-8">
          The hosted Max Pay / Hyp test checkout was cancelled before payment completion.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/checkout" className="btn-primary">Return to checkout</Link>
          <Link href="/" className="btn-secondary">Back to store</Link>
        </div>
      </section>
    </main>
  );
}
