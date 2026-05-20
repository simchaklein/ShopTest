import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PaymentSuccess() {
  const router = useRouter();
  const reference = typeof router.query.Order === 'string'
    ? router.query.Order
    : typeof router.query.orderId === 'string'
      ? router.query.orderId
      : typeof router.query.asmachta === 'string'
        ? router.query.asmachta
        : '';

  return (
    <main dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-6 text-right">
      <Head>
        <title>התשלום התקבל בהצלחה | ShopTest</title>
      </Head>
      <section className="max-w-xl w-full bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl">
        <p className="text-5xl mb-6" aria-hidden="true">✓</p>
        <h1 className="text-3xl font-bold mb-4 text-primary">התשלום התקבל בהצלחה</h1>
        <p className="text-muted leading-8 mb-6">
          תודה, התשלום נקלט במערכת. פרטי העסקה נבדקים ומאומתים.
        </p>
        {reference && (
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-6 text-sm text-primary">
            אסמכתא בטוחה: <strong>{reference.slice(0, 80)}</strong>
          </div>
        )}
        <p className="text-sm text-muted leading-7 mb-8">
          מעבר לעמוד הצלחה אינו מחליף אימות notify/callback כאשר הוא נדרש לעדכון סטטוס סופי.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {reference && <Link href={`/orders?orderId=${reference}`} className="btn-secondary">צפייה בהזמנה</Link>}
          <Link href="/" className="btn-primary">חזרה לחנות</Link>
        </div>
      </section>
    </main>
  );
}
