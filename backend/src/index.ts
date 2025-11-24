import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import express, { Request, Response } from "express";
import { articles } from './db/schema.ts';

// Create a connection to the database
const db = drizzle(process.env.DATABASE_URL!);

// Create a new express application instance
const app = express();
app.use(express.json());

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
app.get("/status", (req: Request, res: Response) => {
  res.json({ message: "Backend Operational" });
});

app.get("/getAllArticles", async (req: Request, res: Response) => {
  const resp = await db.select().from(articles);
  res.json({ resp });
});

app.get("/getArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;

  const resp = await db.select()
    .from(articles)
    .where(eq(articles.id, articleId));
  res.json({ resp });
});

app.post("/postArticle", async (req: Request, res: Response) => {
  const resp = await db
    .insert(articles)
    .values({
      ...req.body,
      date: new Date(req.body.date)
    });
  res.json({ resp });
});

app.put("/putArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const resp = await db.update(articles)
    .set({
      name: req.body.name,
      date: new Date(req.body.date),
      text: req.body.text
    })
    .where(eq(articles.id, articleId));
  res.json({ resp });
});

app.delete("/deleteArticle/:articleId", async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const resp = await db.delete(articles)
    .where(eq(articles.id, articleId));

  res.json({ resp });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
