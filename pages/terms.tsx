import Head from 'next/head';
import Link from 'next/link';

const sections = [
  ['אמצעי תשלום', 'ניתן לשלם באמצעי התשלום שהעסק מאפשר דרך עמוד התשלום המאובטח.'],
  ['אבטחת תשלום', 'פרטי התשלום מוזנים בעמוד תשלום מאובטח ואינם נשמרים בקוד האתר.'],
  ['ביטולים וזיכויים', 'מדיניות ביטולים וזיכויים תיקבע לפי מדיניות העסק בפועל ובהתאם לדין החל.'],
  ['יצירת קשר', 'יש לעדכן כאן את פרטי יצירת הקשר של העסק לפני מעבר לייצור.'],
];

export default function TermsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-background p-6 text-right">
      <Head>
        <title>תנאי עסקה ותשלום | ShopTest</title>
      </Head>
      <section className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-primary">תנאי עסקה ותשלום</h1>
        <p className="text-muted leading-8 mb-8">
          יש לעדכן את תנאי העסקה בהתאם למדיניות העסק בפועל.
        </p>
        <div className="space-y-6 mb-8">
          {sections.map(([title, body]) => (
            <section key={title} className="border-t border-gray-100 pt-5">
              <h2 className="text-xl font-bold mb-2 text-primary">{title}</h2>
              <p className="text-muted leading-8">{body}</p>
            </section>
          ))}
        </div>
        <Link href="/" className="btn-primary">חזרה לחנות</Link>
      </section>
    </main>
  );
}
