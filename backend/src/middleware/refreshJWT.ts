import { Request, Response, NextFunction } from "express";
import { validateCall } from "./validateCall.ts";
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.ts';
import { decodeJWT, generateSignedJWT, verifySignature } from "../helpers/jwt.ts";

const db = drizzle(process.env.DATABASE_URL!);

export async function refreshJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get related user from jwt
  const potentialUsers = await db
    .select()
    .from(users)
    .where(eq(users.id, req.jwt.payload.uid));

  const user = potentialUsers[0];

  if (user.refresh_token === null) {
    return res.status(403).json({
      error: "No Refresh Token"
    });
  }

  const [header, payload, signature] = user.refresh_token.split(".");

  const validJWT: boolean = verifySignature(header, payload, signature);

  if (!validJWT) {
    return res.status(403).json({
      error: "How did an invalid token get in my database?"
    });
  };

  let refreshToken;
  try {
    refreshToken = decodeJWT(user.refresh_token)
  } catch {
    return res.status(403).json({
      error: "How did an invalid token get in my database?"
    });
  }

  const validClaims: boolean =
    refreshToken.header.alg === "HS256" &&
    refreshToken.header.typ === "JWT";

  const expired: boolean = refreshToken.payload.exp < Math.floor(Date.now() / 1000);

  if (!validClaims || expired) {
    return res.status(403).json({
      error: "Expired Refresh Token"
    });
  }

  const toExpire = 60 * 15;
  const jwt = generateSignedJWT(user.id, user.permissions, toExpire)
  res.set("X-New-Access-Token", jwt);

  // Have to overwrite with new jwt
  // Also I ain't try/catching cause I just made it
  const parsedJWT = decodeJWT(jwt);
  req.jwt = parsedJWT;

  return validateCall(req, res, next);
};
