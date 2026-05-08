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

## Changing Hyp / Max Pay Settings Later

Use environment variables only when changing Hyp / Max Pay settings. Do not hardcode credentials in source code. Do not write credentials into .maxpay files or this guide.

### Where credentials live
- Local development: .env or .env.local.
- Vercel / hosting: project environment variables.
- Never in code.
- Never in .maxpay files.

### Change terminal / masof
- HYP_TERMINAL

### Change API user/password
- HYP_USER
- HYP_PASSWORD

### Change API endpoint
- HYP_ENDPOINT

Test and production endpoints are different. Do not use the Hyp panel/login URL as the API endpoint. The API endpoint should come from Hyp API docs, the Hyp panel, or Hyp/Max onboarding, and is expected to be an API Relay endpoint such as an /xpo/Relay path when that is what Hyp provides for the terminal.

### Change merchant ID if required
- HYP_MID

### Switch from test to production
Set:

- MAXPAY_ENV=production

Also update these with production values from Hyp/Max:

- HYP_ENDPOINT
- HYP_TERMINAL
- HYP_USER
- HYP_PASSWORD
- HYP_MID, if required

### Change callback and return URLs
- MAXPAY_PUBLIC_BASE_URL
- MAXPAY_SUCCESS_URL
- MAXPAY_FAILED_URL
- MAXPAY_CANCEL_URL
- MAXPAY_NOTIFY_URL

### Enable or disable features
- MAXPAY_ENABLE_CORE_CHECKOUT
- MAXPAY_ENABLE_DIAGNOSTICS
- MAXPAY_ENABLE_RECURRING
- MAXPAY_ENABLE_INVOICES
- MAXPAY_ENABLE_APPLE_PAY
- MAXPAY_ENABLE_GOOGLE_PAY

Credentials are controlled through env only. Callback URLs are controlled through env only. Features are controlled through flags. Use this guide for future prompts. Never hardcode Hyp credentials.

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
