# Max Pay Local Installer Guide

## What was installed
Max Pay / Hyp test-mode integration foundation for ShopTest.

## Project stack
- Framework: Next.js
- Routing model: Pages Router
- Backend available: yes, via `pages/api/*`

## Installed files and routes
- `lib/maxpay/config.ts`
- `lib/maxpay/payment-request.ts`
- `lib/maxpay/response-mac.ts`
- `lib/maxpay/recurring.ts`
- `lib/maxpay/invoices.ts`
- `lib/maxpay/wallets.ts`
- `pages/api/max-pay/checkout.ts`
- `pages/api/max-pay/notify.ts`
- `pages/api/max-pay/diagnostics.ts`
- `pages/payment/success.tsx`
- `pages/payment/failed.tsx`
- `pages/payment/cancel.tsx`
- `pages/payment/test.tsx`
- `pages/terms.tsx`

## Environment variables
Use variable names only here. Do not write secret values into this guide.

- MAXPAY_ENV
- MAXPAY_ENABLE_CORE_CHECKOUT
- MAXPAY_ENABLE_RECURRING
- MAXPAY_ENABLE_INVOICES
- MAXPAY_ENABLE_APPLE_PAY
- MAXPAY_ENABLE_GOOGLE_PAY
- MAXPAY_ENABLE_DIAGNOSTICS
- MAXPAY_PUBLIC_BASE_URL
- MAXPAY_SUCCESS_URL
- MAXPAY_FAILED_URL
- MAXPAY_CANCEL_URL
- MAXPAY_NOTIFY_URL
- HYP_TERMINAL
- HYP_USER
- HYP_PASSWORD
- HYP_MID
- HYP_ENDPOINT

## Git/state warning
`.maxpay/install-state.json` is local Max Pay installation state. It contains no secrets, but it is normally recommended not to commit it. If it is deleted or corrupted after token binding, you may need to request/register for a new install token.

## Testing
- Run `npm run build` before deploy.
- Open `/payment/test` to view local ShopTest diagnostics.
- Use Hyp TEST credentials only.
- Do not use real card/customer data in this QA app.

## Useful prompts for future maintenance

1. Run diagnostics

```text
Run Max Pay diagnostics in this project. Check routes, env vars, responseMac validation, feature flags, payment pages, provider conflicts, and build/test status if available. Do not delete or overwrite existing code. Return a clear PASS / WARNING / FAIL checklist.
```

2. Switch from test to production

```text
Switch this Max Pay integration from test mode to production mode. Do not change code structure. Show which env vars need real production values and where to set them locally and in hosting. Do not print, store, or hardcode secret values.
```

3. Update terminal/provider credentials

```text
Update the Max Pay / Hyp terminal/provider configuration for this project. Only update env variable names/placeholders and config references. Do not hardcode credentials. Do not touch unrelated payment logic.
```

4. Enable recurring payments

```text
Enable recurring payments for the existing Max Pay integration. Use the installed recurring infrastructure. Do not reinstall the full integration. Only enable required config flags and add missing safe pieces if needed.
```

5. Enable Apple Pay / Google Pay

```text
Enable Apple Pay / Google Pay for the existing Max Pay integration. Use the existing installed infrastructure. Check required Max Pay/Hyp configuration and show any manual setup steps. Do not remove existing checkout logic.
```

6. Check payment provider conflicts

```text
Check for payment provider conflicts in this project. Preserve existing code. Make Max Pay the active provider if it is not already active. Disable conflicting flows only through config or feature flags. Summarize every change.
```

7. Repair missing files

```text
Repair the existing Max Pay integration. Scan for missing or incomplete files, routes, config, env placeholders, responseMac validation, and payment pages. Recreate only missing or broken parts. Do not duplicate files. Do not overwrite custom code without explaining.
```

8. Regenerate the Max Pay LLM guide

```text
Regenerate .maxpay/llm-install-guide.md based on the current Max Pay integration in this project. Include installed files, routes, feature flags, testing instructions, debugging prompts, and production readiness checklist. Do not include secrets.
```
