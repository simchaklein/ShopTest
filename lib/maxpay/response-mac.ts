import crypto from 'crypto';

function normalizeValue(value: unknown) {
  if (value === undefined || value === null) return '';
  return String(value);
}

export function buildResponseMacPayload(params: Record<string, unknown>, fields: string[]) {
  return fields.map((field) => normalizeValue(params[field])).join('');
}

export function signHypPayload(payload: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

export function timingSafeEqualText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateResponseMac(params: Record<string, unknown>, secret: string) {
  const responseMac = normalizeValue(params.responseMac || params.ResponseMac || params.MAC);
  if (!responseMac || !secret) {
    return {
      valid: false,
      reason: responseMac ? 'missing_secret' : 'missing_response_mac',
    };
  }

  const macFields = normalizeValue(params.MacFields || params.macFields)
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean);

  if (macFields.length === 0) {
    return {
      valid: false,
      reason: 'missing_mac_fields',
    };
  }

  const payload = buildResponseMacPayload(params, macFields);
  const expected = signHypPayload(payload, secret);

  return {
    valid: timingSafeEqualText(expected, responseMac),
    reason: timingSafeEqualText(expected, responseMac) ? 'ok' : 'mac_mismatch',
  };
}
