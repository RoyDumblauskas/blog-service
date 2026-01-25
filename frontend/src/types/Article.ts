import { z } from 'zod';

export const ArticleSchema = z.object({
  id: z.string(),
  name: z.string(),
  article_status: z.enum(["draft", "published", "archived"]),
  author_id: z.string(),
  slug: z.string(),
  summary: z.string(),
  date_created: z.string(),
  last_edit: z.string(),
  date_published: z.string().nullable(),
});

export const ArticleListSchema = z.array(ArticleSchema);
export type Article = z.infer<typeof ArticleSchema>;
