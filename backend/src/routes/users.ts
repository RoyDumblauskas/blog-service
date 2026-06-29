import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.ts';
import express, { Request, Response } from "express";
import { auth } from '../middleware/auth.ts';

const db = drizzle(process.env.DATABASE_URL!);
export const usersRouter = express.Router();

usersRouter.get("/getUsers", auth, async (req: Request, res: Response) => {
  if (req.jwt.payload.prm != 77)
    return res
      .status(403)
      .json({
        error: "403: Forbidden"
      });

  const resp = await db.select().from(users);
  res.json(resp)
});

usersRouter.get("/getUser/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const parsedId = Array.isArray(userId) ? userId[0] : userId;

  const resp = await db.select()
    .from(users)
    .where(eq(users.id, parsedId));

  res.json(resp);
});

usersRouter.post("/createUser", async (req: Request, res: Response) => {
  const resp = await db
    .insert(users)
    .values({
      ...req.body
    });

  res.json(resp);
});

usersRouter.delete("/deleteUser/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const parsedId = Array.isArray(userId) ? userId[0] : userId;

  const resp = await db
    .delete(users)
    .where(eq(users.id, parsedId));

  res.json(resp);
});

usersRouter.put("/updateUser/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const parsedId = Array.isArray(userId) ? userId[0] : userId;

  const resp = await db
    .update(users)
    .set({
      ...req.body
    })
    .where(eq(users.id, parsedId));

  res.json(resp);
});
