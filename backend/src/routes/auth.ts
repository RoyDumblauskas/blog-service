import { drizzle } from 'drizzle-orm/node-postgres';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.ts';
import express, { Request, Response } from "express";
import { generateSignedJWT, base64UrlDecode } from '../helpers/jwt.ts';
import { loadJWT } from '../middleware/loadJWT.ts';

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

  loginUser(username, password, res);
});

authRouter.put("/logout", loadJWT, async (req: Request, res: Response) => {
  // since login is controlled by a jwt, all we can do here is wipe the refresh_token
  // frontend will be responsible for clearing temp token from cache/cookies
  // This endpoint will require a logged in user (valid jwt)
  const resp = await db
    .update(users)
    .set({ refresh_token: null, logged_in: false })
    .where(eq(users.id, req.jwt.payload.uid));

  res.json(resp);
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { username, password, display_name } = req.body

  const hashedPassword = crypto
    .createHmac('sha256', hashSecret)
    .update(`${presalt}${password}${postsalt}`)
    .digest("base64url");

  await db
    .insert(users)
    .values({
      display_name: display_name,
      username: username,
      hashed_password: hashedPassword,
      permissions: 44
    });

  loginUser(username, password, res);
});

// because it write the response, has to be last step
async function loginUser(username: string, password: string, res: Response) {
  const hashedPassword = crypto
    .createHmac('sha256', hashSecret)
    .update(`${presalt}${password}${postsalt}`)
    .digest("base64url");

  const potentialUsers = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const user = potentialUsers[0];

  if (!user) {
    return res.status(401).json({
      error: "401: Invalid Username",
    });
  }

  const calculatedBuff = Buffer.from(hashedPassword);
  const storedBuff = Buffer.from(user.hashed_password);

  const match = calculatedBuff.length === storedBuff.length &&
    crypto.timingSafeEqual(calculatedBuff, storedBuff);

  if (!match)
    return res.status(401).json({ error: "401: Failed to authenticate username/password" });

  // fifteen minutes
  const tempToExpire = 60 * 15;
  const jwt = generateSignedJWT(user.id, user.permissions, tempToExpire)

  // seven days
  const refreshToExpire = 60 * 60 * 24 * 7;
  const refreshjwt = generateSignedJWT(user.id, user.permissions, refreshToExpire);

  const resp = await db
    .update(users)
    .set({
      refresh_token: refreshjwt,
      logged_in: true
    })
    .where(eq(users.id, user.id));

  res.json({
    signed_jwt: jwt,
    refresh_resp: resp
  });
}
