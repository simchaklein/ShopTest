import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getMaxPayConfig, getMissingMaxPayEnv } from '../../../lib/maxpay/config';

const requiredFiles = [
  'lib/maxpay/config.ts',
  'lib/maxpay/payment-request.ts',
  'lib/maxpay/response-mac.ts',
  'pages/api/max-pay/checkout.ts',
  'pages/api/max-pay/notify.ts',
  'pages/payment/success.tsx',
  'pages/payment/failed.tsx',
  'pages/payment/cancel.tsx',
  'pages/payment/test.tsx',
  'pages/terms.tsx',
];

function fileExists(relativePath: string) {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const config = getMaxPayConfig(req);
  const missingEnv = getMissingMaxPayEnv(config);
  const missingFiles = requiredFiles.filter((file) => !fileExists(file));
  const status = missingFiles.length > 0
    ? 'FAIL'
    : missingEnv.length > 0
      ? 'SKIPPED_MISSING_CREDENTIALS'
      : 'PASS_WITH_WARNINGS';

  res.status(200).json({
    status,
    checks: {
      framework: 'nextjs-pages-router',
      missingFiles,
      missingEnv,
      maxPayEnv: config.env,
      endpointMode: config.endpoint.includes('hyp.co.il') ? 'hyp' : 'custom',
      secretsInFrontend: 'not_detected_by_static_route_check',
    },
    note: 'Diagnostics are local to ShopTest and are not sent to Max Pay MCP backend.',
  });
}
