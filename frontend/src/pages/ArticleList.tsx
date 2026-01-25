import { useState, useEffect } from 'react';
// import { Button } from '@mui/material';
import type { Article } from '../types/Article.ts';
import { ArticleListSchema } from '../types/Article.ts';
import ArticleCard from '../components/ArticleCard.tsx';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);

  async function getAllArticles() {
    const result = await fetch(
      "/api/articles/getAllArticles",
      {
        method: "GET",
        headers: { "Accept": "application/json" }
      }
    );

    const json = await result.json();
    const data = ArticleListSchema.parse(json);
    setArticles(data);
  };

  useEffect(() => {
    getAllArticles();
  }, []);

  return (
    <div className="p-3 flex flex-col gap-5">
      {/*<Button
        style={{ border: "solid", borderWidth: "1px" }}
        onClick={() => getAllArticles()}
      >
        Refresh
      </Button>*/}
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))] gap-5">
        {articles.map((article) => (<ArticleCard key={article.id} article={article} />))}
      </div>
    </div >
  );
};
