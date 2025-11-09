import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="flex-row">
      <Button
        variant="outlined"
        component={Link}
        to="/"
      >
        Home
      </Button>
      <Button
        variant="outlined"
        component={Link}
        to="/article"
      >
        Article
      </Button>

    </div>
  );
};
