import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { articles } from '../db/schema.ts';
import express, { Request, Response } from "express";
import { Permission, requirePermissions } from '../helpers/authenticate.ts';

const db = drizzle(process.env.DATABASE_URL!);
export const articlesRouter = express.Router();

articlesRouter.get("/getAllArticles", async (_, res: Response) => {
  const resp = await db.select().from(articles);
  res.json(resp);
});

articlesRouter.get("/getArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const parsedId = Array.isArray(articleId) ? articleId[0] : articleId;

  const resp = await db.select()
    .from(articles)
    .where(eq(articles.id, parsedId));

  if (!requirePermissions(
    req.jwt.payload.prm,
    req.jwt.payload.uid === resp[0].author_id,
    Permission.read)) {

    res.status(403).json({
      error: "Insufficient Permissions"
    });
  };

  res.json(resp);
});

articlesRouter.get("/getArticleBySlug/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const parsedSlug = Array.isArray(slug) ? slug[0] : slug;

  const resp = await db.select()
    .from(articles)
    .where(eq(articles.slug, parsedSlug));
  res.json(resp);
});

articlesRouter.post("/postArticle", async (req: Request, res: Response) => {
  const resp = await db
    .insert(articles)
    .values({
      ...req.body,
      slug: req.body.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    });
  res.json(resp);
});

articlesRouter.put("/updateArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const parsedId = Array.isArray(articleId) ? articleId[0] : articleId;

  const resp = await db.update(articles)
    .set({
      ...req.body,
      last_edit: new Date(Date.now()),
      date_published: req.body.article_status == "published" ? new Date(Date.now()) : null
    })
    .where(eq(articles.id, parsedId));
  res.json(resp);
});

articlesRouter.delete("/deleteArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const parsedId = Array.isArray(articleId) ? articleId[0] : articleId;

  const resp = await db.delete(articles)
    .where(eq(articles.id, parsedId));

  res.json(resp);
});
