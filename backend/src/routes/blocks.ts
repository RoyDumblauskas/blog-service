import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { articleBlocks } from '../db/schema.ts';
import express, { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);
export const blocksRouter = express.Router();

blocksRouter.get("/getAllBlocks", async (_: Request, res: Response) => {
  const resp = await db.select().from(articleBlocks);

  res.json(resp);
});

blocksRouter.get("/getBlocks/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const parsedId = Array.isArray(articleId) ? articleId[0] : articleId;

  const resp = await db.select()
    .from(articleBlocks)
    .where(eq(articleBlocks.article_id, parsedId));

  res.json(resp);
});

blocksRouter.post("/createBlock", async (req: Request, res: Response) => {
  const resp = await db
    .insert(articleBlocks)
    .values({
      ...req.body
    });

  res.json(resp);
});

blocksRouter.put("/updateBlock/:blockId", async (req: Request, res: Response) => {
  const { blockId } = req.params;
  const parsedId = Array.isArray(blockId) ? blockId[0] : blockId;

  const resp = await db
    .update(articleBlocks)
    .set({
      ...req.body
    })
    .where(eq(articleBlocks.id, parsedId));

  res.json(resp);
});

blocksRouter.delete("/deleteBlock/:blockId", async (req: Request, res: Response) => {
  const { blockId } = req.params;
  const parsedId = Array.isArray(blockId) ? blockId[0] : blockId;

  const resp = await db
    .delete(articleBlocks)
    .where(eq(articleBlocks.id, parsedId));

  res.json(resp);
});
