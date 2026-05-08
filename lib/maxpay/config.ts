export type MaxPayConfig = {
  env: 'test' | 'production';
  enabled: boolean;
  diagnosticsEnabled: boolean;
  terminal: string;
  mid: string;
  user: string;
  password: string;
  endpoint: string;
  successUrl: string;
  failedUrl: string;
  cancelUrl: string;
  notifyUrl: string;
};


function readFlag(name: string, defaultValue: boolean) {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

function hasUsableEnvValue(value: string) {
  if (!value) return false;
  const normalized = value.trim().toUpperCase();
  return !normalized.startsWith('PLACEHOLDER_') && !normalized.startsWith('YOUR_');
}

function requiredUrl(baseUrl: string, path: string) {
  if (!baseUrl) return '';
  return new URL(path, baseUrl).toString();
}

export function getMaxPayBaseUrl(req?: { headers?: { host?: string | string[]; 'x-forwarded-proto'?: string | string[] } }) {
  if (process.env.MAXPAY_PUBLIC_BASE_URL) return process.env.MAXPAY_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  const hostHeader = req?.headers?.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  if (!host) return '';

  const protoHeader = req?.headers?.['x-forwarded-proto'];
  const proto = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader || 'http';
  return `${proto}://${host}`;
}

export function getMaxPayConfig(req?: { headers?: { host?: string | string[]; 'x-forwarded-proto'?: string | string[] } }): MaxPayConfig {
  const baseUrl = getMaxPayBaseUrl(req);

  return {
    env: process.env.MAXPAY_ENV === 'production' ? 'production' : 'test',
    enabled: readFlag('MAXPAY_ENABLE_CORE_CHECKOUT', true),
    diagnosticsEnabled: readFlag('MAXPAY_ENABLE_DIAGNOSTICS', true),
    terminal: process.env.HYP_TERMINAL || '',
    mid: process.env.HYP_MID || '',
    user: process.env.HYP_USER || '',
    password: process.env.HYP_PASSWORD || '',
    endpoint: process.env.HYP_ENDPOINT || '',
    successUrl: process.env.MAXPAY_SUCCESS_URL || requiredUrl(baseUrl, '/payment/success'),
    failedUrl: process.env.MAXPAY_FAILED_URL || requiredUrl(baseUrl, '/payment/failed'),
    cancelUrl: process.env.MAXPAY_CANCEL_URL || requiredUrl(baseUrl, '/payment/cancel'),
    notifyUrl: process.env.MAXPAY_NOTIFY_URL || requiredUrl(baseUrl, '/api/max-pay/notify'),
  };
}

export function getMissingMaxPayEnv(config = getMaxPayConfig()) {
  const missing = [];
  if (!hasUsableEnvValue(config.terminal)) missing.push('HYP_TERMINAL');
  if (!hasUsableEnvValue(config.mid)) missing.push('HYP_MID');
  if (!hasUsableEnvValue(config.user)) missing.push('HYP_USER');
  if (!hasUsableEnvValue(config.password)) missing.push('HYP_PASSWORD');
  if (!hasUsableEnvValue(config.endpoint)) missing.push('HYP_ENDPOINT');
  return missing;
}
