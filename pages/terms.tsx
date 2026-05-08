import Head from 'next/head';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <Head>
        <title>Terms | ShopTest</title>
      </Head>
      <section className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-4">ShopTest terms</h1>
        <p className="text-muted mb-4">
          ShopTest is a QA storefront for testing hosted Max Pay / Hyp payment flows.
        </p>
        <p className="text-muted mb-8">
          Do not use real customer card data in this environment. Use Hyp / Max test terminal credentials and approved test cards only.
        </p>
        <Link href="/" className="btn-primary">Back to store</Link>
      </section>
    </main>
  );
}
