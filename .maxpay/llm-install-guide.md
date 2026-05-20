# מדריך אינטגרציית Max Pay / Hyp

## 1. מטרת המסמך

המסמך נוצר בתוך פרויקט הלקוח ומיועד למפתח או לסוכן קוד עתידי. הוא מסביר איך אינטגרציית הסליקה בנויה, איך לתחזק אותה בבטחה, ואיפה לשנות הגדרות בלי לחשוף סודות.

זהו מסמך לקוח בלבד. הוא לא מסמך פנימי של Max Pay.

## 2. סיכום התקנה

- Framework: nextjs
- Routing model: next-pages-router
- Backend available: yes
- Active provider mode: yaadpay_hosted
- Diagnostics status: SKIPPED_MISSING_CREDENTIALS
- קובץ state מקומי: .maxpay/install-state.json
- קובץ מדריך יחיד: .maxpay/llm-install-guide.md

## 3. קבצים ונתיבים שהותקנו

- .maxpay/install-state.json
- .maxpay/llm-install-guide.md
- .env.example
- lib/maxpay/config.ts
- lib/maxpay/payment-request.ts
- lib/maxpay/response-mac.ts
- lib/maxpay/recurring.ts
- lib/maxpay/invoices.ts
- lib/maxpay/wallets.ts
- pages/api/max-pay/checkout.ts
- pages/api/max-pay/notify.ts
- pages/api/max-pay/diagnostics.ts
- pages/payment/success.tsx
- pages/payment/failed.tsx
- pages/payment/cancel.tsx
- pages/terms.tsx

## 4. איך עובד תהליך התשלום

1. המשתמש בוחר מוצר, תוכנית או סל.
2. ה-Frontend קורא לשרת של הפרויקט.
3. השרת מחשב סכום ויוצר בקשת תשלום.
4. השרת מחזיר כתובת תשלום או מפנה לעמוד Hyp.
5. המשתמש משלים או מבטל את התשלום בעמוד Hyp.
6. Hyp מחזיר את המשתמש ל-/payment/success, /payment/failed או /payment/cancel.
7. Hyp שולח notify/callback ל-/api/max-pay/notify אם הוא מוגדר.
8. השרת מאמת responseMac כאשר הנתונים קיימים.
9. סטטוס תשלום מקומי מתעדכן לפי האימות, לא לפי redirect בלבד.

ה-Frontend לעולם לא מקבל credentials.

## 5. Provider modes

### yaadpay_hosted

מתאים למסופים שעובדים עם Hosted payment page.

- MAXPAY_PROVIDER_MODE=yaadpay_hosted
- HYP_PAYMENT_PAGE_URL
- HYP_TERMINAL
- HYP_API_KEY
- HYP_PASSP
- HYP_MID

### hyp_relay_api

מתאים ל-Relay API מלא ולפעולות מתקדמות יותר.

- MAXPAY_PROVIDER_MODE=hyp_relay_api
- HYP_ENDPOINT
- HYP_USER
- HYP_PASSWORD
- HYP_TERMINAL
- HYP_MID

כללים:

- לא לנחש provider mode.
- לא להשתמש בכתובת פאנל Hyp בתור endpoint.
- לא להשתמש בפרטי login של הפאנל כ-API credentials בלי אישור מפורש מהפאנל או מהתיעוד.
- אם המיפוי לא ברור, עוצרים ומבקשים מיפוי.

## 6. משתני סביבה

| Env Key | תפקיד | הערה |
| --- | --- | --- |
| MAXPAY_ENV | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_PROVIDER_MODE | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_CORE_CHECKOUT | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_DIAGNOSTICS | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_RECURRING | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_INVOICES | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_APPLE_PAY | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_GOOGLE_PAY | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_REFUNDS | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_ENABLE_TRANSACTION_INQUIRY | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_PUBLIC_BASE_URL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_SUCCESS_URL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_FAILED_URL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_CANCEL_URL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| MAXPAY_NOTIFY_URL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_PAYMENT_PAGE_URL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_ENDPOINT | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_TERMINAL | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_USER | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_PASSWORD | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_API_KEY | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_PASSP | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |
| HYP_MID | הגדרת Max Pay / Hyp | שם בלבד, ללא ערך סודי |

כל הערכים נשמרים ב-.env מקומי או ב-hosting env בלבד. אין לשמור values במסמך הזה.

## 7. API contracts

### POST /api/max-pay/checkout

- server-side בלבד.
- מחשב או מקבל order קיים מהשרת.
- בונה בקשת תשלום.
- מחזיר redirect/payment URL בלבד.
- לא מחזיר credentials.

### /api/max-pay/notify

- חייב להיות ציבורי ונגיש ל-Hyp.
- לא מוגן בסיסמה.
- מאמת responseMac אם נדרש.
- לא שומר payload רגיש.

### /payment/success, /payment/failed, /payment/cancel

- עמודי UI בלבד.
- redirect לעמוד success לא מוכיח תשלום סופי ללא notify/callback או אימות מתאים.

## 8. התאמה לקוד קיים

- לא למחוק Stripe, PayPal או provider קיים בלי אישור.
- לא ליצור duplicate routes.
- לא לדרוס checkout מותאם אישית בשקט.
- להשתמש ב-feature flags או provider switch כאשר יש יותר מספק אחד.

## 9. מה סוכן קוד רשאי לשנות לבד

מותר:

- להתאים imports ונתיבים.
- ליצור route חסר לפי framework קיים.
- להוסיף env placeholders.
- לתקן קבצים חסרים של diagnostics או docs.
- לשפר טקסטים ועיצוב של עמודי payment.
- להריץ diagnostics.

אסור בלי אישור מפורש:

- להכניס credentials לקוד או ל-Frontend.
- לעבור ל-production.
- לשנות responseMac.
- לסמן תשלום כהצליח בלי אימות.
- להפעיל recurring live.
- לבצע refunds.
- למחוק provider קיים.

## 10. אבטחת credentials

- רק server env או hosting env.
- לא ב-Frontend.
- לא ב-localStorage.
- לא ב-public env.
- לא בקבצי .maxpay.
- לא בלוגים.
- לא ב-client bundle.

## 11. דיאגנוסטיקה

סטטוסים:

- PASS
- PASS_WITH_WARNINGS
- FAIL
- SKIPPED_MISSING_CREDENTIALS

בדיקות אחרונות:

- routes_pages_exist: PASS - Required Max Pay routes/pages exist
- env_placeholders_exist: PASS - Required env placeholders exist
- response_mac_helper_exists: PASS - responseMac helper exists
- callback_notify_exists: PASS - callback/notify route exists
- frontend_secret_scan: PASS - No obvious frontend secret markers found
- provider_conflicts: PASS - No provider conflicts detected
- sandbox_credentials: SKIPPED_MISSING_CREDENTIALS - Missing env vars: HYP_PAYMENT_PAGE_URL, HYP_TERMINAL
- framework_detected: PASS - nextjs/next-pages-router

## 12. מעבר מטסט לפרודקשן

Checklist:

- MAXPAY_ENV
- MAXPAY_PROVIDER_MODE אם נדרש
- HYP_PAYMENT_PAGE_URL או HYP_ENDPOINT
- credentials מתאימים
- HYP_TERMINAL
- HYP_MID אם נדרש
- MAXPAY_PUBLIC_BASE_URL
- MAXPAY_SUCCESS_URL
- MAXPAY_FAILED_URL
- MAXPAY_CANCEL_URL
- MAXPAY_NOTIFY_URL
- diagnostics
- עסקת בדיקה לפי נהלי Hyp

## 13. יכולות מתקדמות

- Recurring: תשתית קיימת וכבויה. דורש תמיכת tokenization. אין שמירת card data.
- Invoices: דורש מודול חשבוניות. כבוי כברירת מחדל.
- Apple Pay / Google Pay: תלוי במסוף. כבוי כברירת מחדל.
- Refunds: עתידי, server/admin-side בלבד, דורש אישור מפורש.
- Transaction inquiry: server-side בלבד ותקציר מסונן בלבד.

## 14. קונפליקטים ומדיניות שינוי

קונפליקטים שזוהו:

- לא זוהו פריטים.

מדיניות migration:

Detect -> Preserve -> Configure safely

## 15. פרומטים מוכנים לתחזוקה

### הרצת דיאגנוסטיקה

```text
הרץ diagnostics לאינטגרציית Max Pay / Hyp בפרויקט הזה. בדוק env, routes, callback/notify, responseMac, עמודי תשלום, קונפליקטים עם ספקי סליקה קיימים, חשיפת סודות ב-Frontend וסטטוס build. החזר PASS / PASS_WITH_WARNINGS / FAIL / SKIPPED_MISSING_CREDENTIALS. אל תמחק או תדרוס קוד קיים.
```

### מעבר לייצור

```text
העבר את אינטגרציית Max Pay / Hyp ממצב test למצב production. אל תקשיח סודות בקוד. הראה אילו משתני סביבה צריך לשנות מקומית וב-hosting. אל תשנה לוגיקת תשלום לא קשורה. אחרי השינוי הרץ diagnostics וסכם סיכונים לפני עלייה לאוויר.
```

### עדכון מסוף / masof

```text
עדכן את הגדרת terminal / masof של Hyp עבור האינטגרציה הקיימת. השתמש רק במשתני סביבה כמו HYP_TERMINAL. אל תקשיח credentials ואל תשנה לוגיקת checkout לא קשורה. לאחר העדכון הרץ diagnostics.
```

### עדכון credentials

```text
עדכן את פרטי ה-API של Hyp / Max Pay בפרויקט. השתמש במשתני סביבה בלבד, למשל HYP_USER, HYP_PASSWORD, HYP_API_KEY או HYP_PASSP לפי provider mode הפעיל. אל תכתוב ערכים סודיים לקוד, למסמכים או ללוגים. בדוק שאין חשיפה ב-Frontend והרץ diagnostics.
```

### עדכון callback URLs

```text
עדכן את כתובות callback והחזרה של Max Pay / Hyp בפרויקט. השתמש בדומיין ה-hosting ועדכן את MAXPAY_PUBLIC_BASE_URL, MAXPAY_SUCCESS_URL, MAXPAY_FAILED_URL, MAXPAY_CANCEL_URL ו-MAXPAY_NOTIFY_URL. אל תשנה לוגיקת checkout לא קשורה. ודא שהנתיבים ציבוריים ונגישים ל-Hyp.
```

### הפעלת recurring

```text
הפעל recurring payments עבור אינטגרציית Max Pay / Hyp הקיימת. השתמש בתשתית שכבר הותקנה וב-feature flags. ודא תחילה שהמסוף תומך ב-tokenization/recurring. אל תשמור פרטי כרטיס. אל תתקין מחדש את האינטגרציה. לאחר השינוי הרץ diagnostics.
```

### הפעלת invoices

```text
הפעל invoices/documents עבור אינטגרציית Max Pay / Hyp הקיימת. בדוק שהמסוף תומך במודול חשבוניות או מסמכים. הוסף רק env/config נדרשים, אל תקשיח סודות, ואל תמחק קוד סליקה קיים. הרץ diagnostics לאחר השינוי.
```

### הפעלת Apple Pay / Google Pay

```text
הפעל Apple Pay / Google Pay עבור אינטגרציית Max Pay / Hyp הקיימת. השתמש בתשתית וב-feature flags שכבר קיימים. בדוק אילו הגדרות נדרשות במסוף Hyp. אל תתקין מחדש את האינטגרציה ואל תסיר checkout קיים. הרץ diagnostics.
```

### בדיקת סטטוס עסקה

```text
בדוק סטטוס עסקה באינטגרציית Max Pay / Hyp הקיימת באמצעות קריאות שרת-צד בטוחות בלבד. החזר תקציר מסונן ללא סודות, ללא פרטי כרטיס וללא payload מלא. אם חסרים credentials או הרשאות, עצור והסבר מה נדרש.
```

### הוספת refund flow

```text
הוסף flow בטוח לזיכוי עסקה עבור אינטגרציית Max Pay / Hyp. השאר אותו כבוי כברירת מחדל, הגבל אותו למפעיל מורשה, דרוש אישור מפורש לפני פעולה כספית, ואל תחשוף credentials. אל תשנה checkout קיים בלי סיבה.
```

### תיקון אינטגרציה

```text
תקן את אינטגרציית Max Pay / Hyp הקיימת. סרוק קבצים, routes, config, env placeholders, responseMac, callback/notify ועמודי תשלום. צור מחדש רק חלקים חסרים או שבורים. אל תשכפל קבצים ואל תדרוס קוד מותאם אישית בלי להסביר.
```

### התאמת עמודי תשלום

```text
התאם את עמודי התשלום של Max Pay / Hyp בפרויקט הזה. עבור על /payment/success, /payment/failed, /payment/cancel ו-/terms. שמור על הלוגיקה הקיימת, אל תחשוף מידע רגיש, ואל תשנה את מנגנון ה-checkout או ה-callback. שפר רק את הטקסטים, העיצוב והקישורים בהתאם למותג. אחרי השינוי הרץ diagnostics.
```

## 16. תקלות נפוצות

### Credentials חסרים או placeholders

- סימפטום: diagnostics מחזיר SKIPPED_MISSING_CREDENTIALS או checkout לא נפתח.
- סיבה אפשרית: חסרים משתני HYP/MAXPAY או נשארו ערכי YOUR_/PLACEHOLDER_.
- מה לבדוק: בדוק שמות env בלבד, provider mode, וסביבת hosting. אל תדפיס ערכים.
- פתרון בטוח: הגדר ערכים אמיתיים ב-.env מקומי או ב-hosting env בלבד. עצור אם לא ברור אילו credentials שייכים למסוף.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### Provider mode לא נכון

- סימפטום: הקוד מנסה Relay API למרות שהמסוף מתאים לעמוד Hosted, או להפך.
- סיבה אפשרית: MAXPAY_PROVIDER_MODE לא מתאים לנתונים שהתקבלו מ-Hyp.
- מה לבדוק: בדוק אם המסוף עובד עם yaadpay_hosted או hyp_relay_api.
- פתרון בטוח: שנה provider mode דרך env בלבד אחרי אימות מול הפאנל או התיעוד.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### Endpoint הוא URL פאנל

- סימפטום: בקשת API מחזירה HTML, login page או auth error לא ברור.
- סיבה אפשרית: HYP_ENDPOINT הוגדר לכתובת login/panel במקום API endpoint.
- מה לבדוק: בדוק שהכתובת מגיעה מתיעוד API או מהגדרות המסוף.
- פתרון בטוח: עדכן HYP_ENDPOINT דרך env בלבד. אם אין endpoint רשמי ברור, עצור ושאל.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### Callback / notify חסום

- סימפטום: התשלום מסתיים אבל notify לא מתקבל.
- סיבה אפשרית: URL לא ציבורי, deployment מוגן בסיסמה, route חסר או method לא נתמך.
- מה לבדוק: בדוק MAXPAY_NOTIFY_URL, status code, auth protection והגדרות Hyp panel.
- פתרון בטוח: השאר נתיבי payment ו-notify ציבוריים. הגן רק על אזורים רגישים.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### responseMac נכשל

- סימפטום: callback או return נדחים בגלל חתימה לא תקינה.
- סיבה אפשרית: סוד, סדר שדות, encoding או כלל חתימה לא מתאימים.
- מה לבדוק: בדוק את כלל responseMac בתיעוד Hyp ואת השדות שנחתמים.
- פתרון בטוח: תקן בצד שרת בלבד. אל תסמן תשלום כהצליח בלי אימות.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### עמוד תשלום לא נפתח

- סימפטום: checkout לא מפנה לעמוד Hyp.
- סיבה אפשרית: חסר HYP_PAYMENT_PAGE_URL, provider mode שגוי, או בניית בקשה שגויה.
- מה לבדוק: בדוק env, logs מסוננים, ובניית URL בצד שרת.
- פתרון בטוח: תקן את server-side builder בלבד. אל תעביר secrets ל-Frontend.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### עמוד תשלום נפתח ולא חוזר

- סימפטום: המשתמש משלם או מבטל אך לא חוזר ל-success/failed/cancel.
- סיבה אפשרית: כתובות return/cancel/error לא מוגדרות נכון ב-env או בפאנל Hyp.
- מה לבדוק: בדוק MAXPAY_SUCCESS_URL, MAXPAY_FAILED_URL, MAXPAY_CANCEL_URL והגדרות הפאנל.
- פתרון בטוח: עדכן URLs ב-env ובפאנל. עצור אם יש הבדל בין Preview ו-Production.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### Build נכשל אחרי התקנה

- סימפטום: npm run build נכשל.
- סיבה אפשרית: import path, alias חסר, ESM/CommonJS mismatch או route convention שונה.
- מה לבדוק: בדוק הודעת build, routing model ו-tsconfig/jsconfig.
- פתרון בטוח: התאם imports ומבנה route לפרויקט בלי לשנות לוגיקת תשלום מעבר לנדרש.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### חשיפת secret ב-Frontend

- סימפטום: credentials מופיעים בקוד client או bundle.
- סיבה אפשרית: שימוש ב-HYP_* בתוך קומפוננטות או public env.
- מה לבדוק: חפש HYP_, PASSP, API_KEY, PASSWORD בקבצי client.
- פתרון בטוח: העבר שימוש בסודות ל-API route/server בלבד וסובב credentials אם נחשפו.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

### התקנה חוזרת או install-state חסר

- סימפטום: rerun נחסם או מנסה להתנהג כהתקנה חדשה.
- סיבה אפשרית: .maxpay/install-state.json נמחק, נפגם או לא תואם.
- מה לבדוק: בדוק שהקובץ כולל app_id ו-installation_id.
- פתרון בטוח: שחזר מגיבוי מקומי אם קיים. אל תנחש identity לפי path, branch, domain או repo.
- מתי לעצור: כאשר נדרש secret אמיתי, שינוי flow עסקי, או שינוי אימות תשלום.

