import crypto from 'crypto';

function normalizeValue(value: unknown, fallback = '') {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
}

function readParam(params: Record<string, unknown>, names: string[], fallback = '') {
  for (const name of names) {
    const value = params[name];
    if (value !== undefined && value !== null && value !== '') return String(value);
  }
  return fallback;
}

export function buildResponseMacPayload(params: Record<string, unknown>, merchantPassword: string) {
  return [
    merchantPassword,
    readParam(params, ['txId', 'TxId', 'txID', 'transactionId']),
    readParam(params, ['errorCode', 'ErrorCode'], '000'),
    readParam(params, ['cardToken', 'CardToken']),
    readParam(params, ['cardExp', 'CardExp']),
    readParam(params, ['personalId', 'PersonalId', 'personalID']),
    readParam(params, ['uniqueId', 'uniqueid', 'UniqueId', 'uniqueID', 'Order', 'order', 'orderId']),
  ].map((value) => normalizeValue(value)).join('');
}

export function calculateResponseMac(params: Record<string, unknown>, merchantPassword: string, encoding: 'base64' | 'hex' = 'base64') {
  const payload = buildResponseMacPayload(params, merchantPassword);
  return crypto.createHash('sha256').update(payload, 'utf8').digest(encoding);
}

export function timingSafeEqualText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateResponseMac(params: Record<string, unknown>, merchantPassword: string) {
  const responseMac = readParam(params, ['responseMac', 'ResponseMac', 'MAC']);
  if (!responseMac || !merchantPassword) {
    return {
      valid: false,
      reason: responseMac ? 'missing_secret' : 'missing_response_mac',
    };
  }

  const expectedBase64 = calculateResponseMac(params, merchantPassword, 'base64');
  const expectedHex = calculateResponseMac(params, merchantPassword, 'hex');
  const valid = timingSafeEqualText(expectedBase64, responseMac) || timingSafeEqualText(expectedHex, responseMac);

  return {
    valid,
    reason: valid ? 'ok' : 'mac_mismatch',
  };
}
