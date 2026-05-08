import Head from 'next/head';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MaxPayTestPage() {
  const { data, error, isLoading } = useSWR('/api/max-pay/diagnostics', fetcher);

  return (
    <main className="min-h-screen bg-background p-6">
      <Head>
        <title>Max Pay Diagnostics | ShopTest</title>
      </Head>
      <section className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-3">Max Pay diagnostics</h1>
        <p className="text-muted mb-8">
          Local ShopTest diagnostics for the Max Pay / Hyp test integration.
        </p>

        {isLoading && <p>Checking integration...</p>}
        {error && <p className="text-red-600">Diagnostics request failed.</p>}
        {data && (
          <pre className="bg-gray-950 text-gray-50 rounded-2xl p-5 overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}
