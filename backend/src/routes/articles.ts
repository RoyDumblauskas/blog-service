import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { articles } from '../db/schema.ts';
import express, { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);
export const articlesRouter = express.Router();

articlesRouter.get("/getAllArticles", async (req: Request, res: Response) => {
  const resp = await db.select().from(articles);
  res.json({ resp });
});

articlesRouter.get("/getArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;

  const resp = await db.select()
    .from(articles)
    .where(eq(articles.id, articleId));
  res.json({ resp });
});

articlesRouter.post("/postArticle", async (req: Request, res: Response) => {
  const resp = await db
    .insert(articles)
    .values({
      ...req.body,
      slug: req.body.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    });
  res.json({ resp });
});

articlesRouter.put("/putArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const resp = await db.update(articles)
    .set({
      name: req.body.name,
      author_id: req.body.author_id,
      slug: req.body.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      summary: req.body.summary,
      article_status: req.body.article_status,
      last_edit: new Date(Date.now()),
      date_published: req.body.article_status == "published" ? new Date(Date.now()) : null
    })
    .where(eq(articles.id, articleId));
  res.json({ resp });
});

articlesRouter.delete("/deleteArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const resp = await db.delete(articles)
    .where(eq(articles.id, articleId));

  res.json({ resp });
});
