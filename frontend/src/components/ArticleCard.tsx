import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/Article.ts';
import { Card, Typography } from '@mui/material';

interface Props {
  article: Article;
}

export default function ArticleCard(props: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="flex flex-col p-5 gap-2 cursor-pointer"
      onClick={() => { navigate(`/article/${props.article.slug}`) }}
    >
      <div className="flex align-center justify-center">
        <Typography variant="h5">
          {props.article.name}
        </Typography>
      </div>
      <div className="flex align-center justify-center">By {props.article.author_id}</div>
      <div className="flex align-center justify-center">{props.article.summary}</div>
    </Card>
  );
};
