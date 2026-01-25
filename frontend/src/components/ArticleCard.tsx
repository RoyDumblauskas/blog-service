import { useNavigate } from 'react-router-dom';
import type { Article } from '../types/Article.ts';
import { Card } from '@mui/material';

interface Props {
  article: Article;
}

export default function ArticleCard(props: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="p-1 cursor-pointer"
      onClick={() => { navigate(`/article/${props.article.slug}`) }}
    >
      {props.article.name}
    </Card>
  );
};
