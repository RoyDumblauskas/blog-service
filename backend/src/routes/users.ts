import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.ts';
import express, { Request, Response } from "express";
import { auth } from '../middleware/auth.ts';

const db = drizzle(process.env.DATABASE_URL!);
export const usersRouter = express.Router();

usersRouter.get("/getUser/:userId", auth, async (req: Request, res: Response) => {
  const { userId } = req.params;


  const resp = await db.select()
    .from(users)
    .where(eq(users.id, userId));

  res.json(resp);
});
