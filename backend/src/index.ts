import 'dotenv/config';
import express, { Response } from 'express';
import { articlesRouter } from './routes/articles.ts';
import { blocksRouter } from './routes/blocks.ts';
import { imagesRouter } from './routes/images.ts';

const app = express();
app.use(express.json());

app.get("/status", (_, res: Response) => {
  res.json({ message: "Backend Operational" });
});

app.use("/articles", articlesRouter);
app.use("/blocks", blocksRouter);
app.use("/images", imagesRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
