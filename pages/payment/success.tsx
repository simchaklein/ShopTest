import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PaymentSuccess() {
  const router = useRouter();
  const orderId = typeof router.query.Order === 'string'
    ? router.query.Order
    : typeof router.query.orderId === 'string'
      ? router.query.orderId
      : '';

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <Head>
        <title>Payment Success | ShopTest</title>
      </Head>
      <section className="max-w-lg bg-white border border-gray-100 rounded-3xl p-10 shadow-xl">
        <p className="text-6xl mb-6">✓</p>
        <h1 className="text-3xl font-bold mb-4 text-primary">Payment received</h1>
        <p className="text-muted mb-8">
          Max Pay / Hyp returned a successful payment result for this test checkout.
        </p>
        <div className="flex flex-col gap-3">
          {orderId && <Link href={`/orders?orderId=${orderId}`} className="btn-primary">View order</Link>}
          <Link href="/" className="btn-secondary">Back to store</Link>
        </div>
      </section>
    </main>
  );
}
