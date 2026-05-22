import { Button, Input } from '@mui/material';
import { Link } from 'react-router-dom';
import ProfilePlaceholder from "../assets/provile.svg";
import "../style.css";

export default function Navbar() {
  // TODO: create search function
  // TODO: Profile integration
  return (
    <div className="bg-color-bold-1 flex flex-row justify-between">
      <div className="flex flex-row justify-start items-center gap-3">
        <Button
          component={Link}
          to="/"
          variant="outlined"
        >
          Home
        </Button>

        <Button
          component={Link}
          to="/articleList"
          variant="outlined"
        >
          Articles
        </Button>
      </div>

      <div className="flex flex-row justify-end items-center gap-3">
        <Input
          placeholder="Search" fullWidth={false} disableUnderline={true}
        />
        <img
          className="
            flex
            h-[3em]
            w-[3em]
            rounded-full"
          src={ProfilePlaceholder} alt="PFP"
        />
      </div>
    </div>
  );
};
