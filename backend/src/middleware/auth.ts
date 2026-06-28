import { Request, Response, NextFunction } from "express";
import crypto from 'crypto';
import JsonWebToken from '../types/JsonWebToken.ts';

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // read jwt
  const authHeader = req.header("Authorization");

  // If there is no jwt, proceed to request with default permissions
  if (!authHeader) {
    req.jwt = defaultJWT;
  } else {
    // otherwise decode the jwt
    const [scheme, token] = authHeader.split(" ");

    if (scheme.toLowerCase() != "bearer") {
      return res.status(401).json({
        error: "Invalid auth scheme (not Bearer)"
      });
    };

    if (token.split(".").length !== 3) {
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }

    const [header, payload, signature] = token.split(".");
    const validJWT: boolean = verifySignature(header, payload, signature);
    let decodedToken: JsonWebToken;

    try {
      decodedToken = decodeJWT(token);
    } catch {
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }

    const validClaims: boolean =
      decodedToken.payload.exp < Math.floor(Date.now() / 1000) &&
      decodedToken.header.alg === "HS256" &&
      decodedToken.header.typ === "JWT";

    if (validJWT && validClaims) {
      req.jwt = decodedToken;
    } else {
      // maybe attempt token refresh here
      return res.status(401).json({
        error: "Invalid JWT"
      });
    }
  }

  next();
};

function verifySignature(header: string, payload: string, signature: string) {
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

function encodeMessage(header: JsonWebToken["header"], payload: JsonWebToken["payload"]) {
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return encodedHeader + "." + encodedPayload;
}

function decodeJWT(token: string) {
  const parts = token.split('.');

  const decodeBase64Url = (str: string) => {
    return Buffer.from(str, "base64url").toString();
  };

  const header = JSON.parse(decodeBase64Url(parts[0]));
  const payload = JSON.parse(decodeBase64Url(parts[1]));
  const signature = parts[2]; // Signature remains encoded

  return { header, payload, signature };
}

// default fallback JWT
// works fine for all calls that only need "guest" auth
// individual routes will fail if prm (permissions)
// are insufficient
const defaultJWT: JsonWebToken =
{
  header: {
    alg: "none",
    typ: "JWT",
  },
  payload: {
    iat: -1,
    uid: "",
    prm: 44,
    exp: -1,
  },
  signature: ""
};
