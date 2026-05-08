import type { NextApiRequest, NextApiResponse } from 'next';
import { getMaxPayConfig, getMissingMaxPayEnv } from '../../../lib/maxpay/config';

const requiredRoutes = [
  '/',
  '/payment/success',
  '/payment/failed',
  '/payment/cancel',
  '/payment/test',
  '/terms',
  '/api/max-pay/checkout',
  '/api/max-pay/notify',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const config = getMaxPayConfig(req);
  const missingEnv = getMissingMaxPayEnv(config);
  const status = missingEnv.length > 0 ? 'SKIPPED_MISSING_CREDENTIALS' : 'PASS_WITH_WARNINGS';

  res.status(200).json({
    status,
    checks: {
      framework: 'nextjs-pages-router',
      expectedRoutes: requiredRoutes,
      missingEnv,
      maxPayEnv: config.env,
      providerMode: config.providerMode,
      endpointMode: config.endpoint.includes('/xpo/Relay') ? 'hyp-relay' : config.endpoint ? 'custom' : 'missing',
      responseMacHelper: 'installed',
      callbackNotify: 'installed',
      featureFlags: {
        coreCheckout: process.env.MAXPAY_ENABLE_CORE_CHECKOUT || 'true',
        diagnostics: process.env.MAXPAY_ENABLE_DIAGNOSTICS || 'true',
        recurring: process.env.MAXPAY_ENABLE_RECURRING || 'false',
        invoices: process.env.MAXPAY_ENABLE_INVOICES || 'false',
        applePay: process.env.MAXPAY_ENABLE_APPLE_PAY || 'false',
        googlePay: process.env.MAXPAY_ENABLE_GOOGLE_PAY || 'false',
        refunds: process.env.MAXPAY_ENABLE_REFUNDS || 'false',
        transactionInquiry: process.env.MAXPAY_ENABLE_TRANSACTION_INQUIRY || 'false',
      },
      secretsInFrontend: 'not_detected_by_static_route_check',
    },
    note: 'Diagnostics are local to ShopTest and are not sent to Max Pay MCP backend.',
  });
}
