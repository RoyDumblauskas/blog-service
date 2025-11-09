import { useParams } from 'react-router';

export default function Article() {
  let { articleId } = useParams();

  return (
    <div id="article">
      <h1>Article: {articleId}</h1>
    </div>
  );
};
