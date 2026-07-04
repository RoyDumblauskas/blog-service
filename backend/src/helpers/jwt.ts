import crypto from 'crypto';
import JsonWebToken from '../types/JsonWebToken.ts';

export function verifySignature(header: string, payload: string, signature: string) {
  const signingSecret = process.env.JWT_SECRET!;
  const encodedMessage = header + "." + payload;

  const calculatedSignature = crypto
    .createHmac('sha256', signingSecret)
    .update(encodedMessage)
    .digest("base64url");

  const csBuff = Buffer.from(calculatedSignature);
  const sBuff = Buffer.from(signature);


  return csBuff.length === sBuff.length &&
    crypto.timingSafeEqual(csBuff, sBuff);
}

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

export function base64UrlDecode(str: string) {
  return Buffer.from(str, "base64url").toString();
};

export function encodeMessage(header: JsonWebToken["header"], payload: JsonWebToken["payload"]): string {
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
}

export function decodeJWT(token: string) {
  const parts = token.split('.');

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2]; // Signature remains encoded

  return { header, payload, signature };
}

export function generateSignedJWT(userId: string, permissions: number, secondsToExpire: number): string {
  const signingSecret = process.env.JWT_SECRET!;

  const now = Math.floor(Date.now() / 1000);
  const expires = now + secondsToExpire;

  const header: JsonWebToken["header"] = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload: JsonWebToken["payload"] = {
    iat: now,
    uid: userId,
    prm: permissions,
    exp: expires
  };

  const encodedMessage = encodeMessage(header, payload);

  const signature = crypto
    .createHmac('sha256', signingSecret)
    .update(encodedMessage)
    .digest("base64url");

  return `${encodedMessage}.${signature}`;
}



