import { Request, Response, NextFunction } from "express";
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from "../db/schema.ts";
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // read/decode jwt


  next();
};

async function getUserPermissions(userId: string) {
  const resp = await db
    .select({ perms: users.permissions })
    .from(users)
    .where(eq(users.id, userId));

  return resp;
}
