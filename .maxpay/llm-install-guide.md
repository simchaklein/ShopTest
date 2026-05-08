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
- HYP_PASSP
- HYP_API_KEY
- HYP_PAYMENT_PAGE_URL
- MAXPAY_ENABLE_TRANSACTION_INQUIRY
- MAXPAY_ENABLE_REFUNDS
- MAXPAY_PROVIDER_MODE

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

## Provider Modes

This integration supports two provider modes.

### Mode A: yaadpay_hosted
Use this mode for the current ShopTest hosted payment-page test when the Hyp panel provides a test terminal, hosted payment page settings, API Key, and PassP-style page authentication.

Required env variable names:

- MAXPAY_PROVIDER_MODE=yaadpay_hosted
- HYP_PAYMENT_PAGE_URL
- HYP_TERMINAL
- HYP_API_KEY
- HYP_PASSP
- MAXPAY_SUCCESS_URL
- MAXPAY_FAILED_URL
- MAXPAY_CANCEL_URL
- MAXPAY_NOTIFY_URL

API Key and PassP must stay server-side or inside the Hyp panel settings. Do not hardcode them and do not expose them in frontend code.

### Mode B: hyp_relay_api
Use this mode later for full Hyp API coverage when Relay credentials are available.

Required env variable names:

- MAXPAY_PROVIDER_MODE=hyp_relay_api
- HYP_ENDPOINT
- HYP_USER
- HYP_PASSWORD
- HYP_TERMINAL
- HYP_MID

Relay API mode is expected to support deeper API operations such as transaction inquiry, refunds/cancellations, invoices/documents, and recurring/tokenization when the terminal and credentials support them.

## Git/state warning
`.maxpay/install-state.json` is local Max Pay installation state. It contains no secrets, but it is normally recommended not to commit it. If it is deleted or corrupted after token binding, you may need to request/register for a new install token.

## Testing
- Run `npm run build` before deploy.
- Open `/payment/test` to view local ShopTest diagnostics.
- Use Hyp TEST credentials only.
- Do not use real card/customer data in this QA app.

## Future Hyp API Capabilities

These capabilities are scaffolded or planned, but most are disabled by default until the terminal, credentials, and diagnostics confirm support.

### Core checkout
Hosted payment page, payment request creation, redirect/payment URL, success/fail/cancel routes.

### Notify / callback
Server-side callback route that updates local payment status and keeps logs safe.

### responseMac validation
Server-side integrity validation for return/callback responses. Never fake success.

### Transaction status / inquiry
Planned for Relay/API mode. Should return only a sanitized transaction summary.

### Refunds / cancellations
Planned as admin-only operations, disabled by default, with explicit confirmation.

### Documents / invoices
Scaffolded and feature-flagged. Do not mark active unless the terminal has invoice/document support and invoice API calls are tested.

### Recurring / tokenization
Scaffolded and feature-flagged. Do not store card data. Do not add automatic future charges until terminal support is verified.

### Digital wallets
Apple Pay / Google Pay infrastructure is feature-flagged. Enable only if Hyp terminal settings support it.

### Future prompts

Prompt: Enable invoices

```text
Enable Hyp invoices/documents for this Max Pay integration. Check if the terminal has invoice/EZcount support enabled. Add required env/config only, do not hardcode secrets, and run diagnostics.
```

Prompt: Get invoice link

```text
Check whether this transaction has an invoice and retrieve the safe invoice link if supported by Hyp. Do not expose credentials or full payment payloads.
```

Prompt: Enable recurring

```text
Enable recurring payments for this Max Pay integration. Use the installed recurring infrastructure. Verify Hyp terminal tokenization support first. Do not store card data.
```

Prompt: Check transaction status

```text
Check the status of a Max Pay / Hyp transaction using the installed integration. Use safe server-side API calls only and return a sanitized summary.
```

Prompt: Add refund flow

```text
Add a safe admin-only refund flow for this Max Pay / Hyp integration. Keep it disabled by default, require confirmation, and do not expose credentials.
```

Prompt: Enable Apple Pay / Google Pay

```text
Enable Apple Pay / Google Pay using the existing Max Pay infrastructure. Check which Hyp terminal settings are required, update feature flags, and run diagnostics.
```

Prompt: Switch provider mode

```text
Switch this integration between yaadpay_hosted and hyp_relay_api mode. Explain which env variables are required for each mode and do not hardcode credentials.
```

Prompt: Switch test to production

```text
Switch this Max Pay / Hyp integration from test mode to production. Show exactly which env variables must change. Do not modify unrelated payment logic and do not hardcode secrets.
```

Prompt: Run diagnostics

```text
Run Max Pay diagnostics. Check provider mode, env vars, callback URLs, responseMac, frontend secrets, feature flags, transaction inquiry support, invoice support, recurring support, and payment routes.
```

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
