import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="flex flex-row gap-3">
      <Button
        component={Link}
        to="/"
        variant="outlined"
        className="flex flex-1"
      >
        Home
      </Button>

      <Button
        component={Link}
        to="/articleList"
        variant="outlined"
        className="flex flex-1"
      >
        Article
      </Button>
      <div className="flex flex-8"></div>
    </div>
  );
};
