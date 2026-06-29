import { drizzle } from 'drizzle-orm/node-postgres';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.ts';
import express, { Request, Response } from "express";
import { generateSignedJWT, base64UrlDecode } from '../helpers/jwt.ts';

const db = drizzle(process.env.DATABASE_URL!);
const hashSecret = process.env.PASSWORD_HASH_SECRET!;
const presalt = process.env.PRESALT!;
const postsalt = process.env.POSTSALT!;
export const authRouter = express.Router();

// username and password => signed jwt
authRouter.get("/login", async (req: Request, res: Response) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401)
    .json({ error: "401: Missing Authorization Header" });

  const [scheme, value] = authHeader.split(" ");

  if (scheme.toLowerCase() != "basic") return res.status(401)
    .json({ error: "401: Incorrect Authorization Scheme" });

  const decodedHeader = base64UrlDecode(value);

  const [username, password] = decodedHeader.split(":");

  const hashedPassword = crypto
    .createHmac('sha256', hashSecret)
    .update(`${presalt}${password}${postsalt}`)
    .digest("base64url");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const calculatedBuff = Buffer.from(hashedPassword);
  const storedBuff = Buffer.from(user[0].hashed_password);

  const match = calculatedBuff.length === storedBuff.length &&
    crypto.timingSafeEqual(calculatedBuff, storedBuff);

  if (!match)
    return res.status(401).json({ error: "401: failed to authenticate username/password" });

  const jwt = generateSignedJWT(user[0].id, user[0].permissions)

  res.json({ signed_jwt: jwt });
});

authRouter.get("/logout", async (req: Request, res: Response) => {

});

authRouter.get("/signup", async (req: Request, res: Response) => {

});
