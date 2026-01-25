import { Button, Input } from '@mui/material';
import { Link } from 'react-router-dom';
import ProfilePlaceholder from "../assets/provile.svg";

export default function Navbar() {
  // TODO: create search function
  // TODO: Profile integration
  return (
    <div className="flex flex-row justify-between">
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
          className="
            rounded-xl
            bg-gray-100
            px-2
            py-1
            text-sm
            text-gray-800
            placeholder-gray-400
            shadow-sm
            transition
            duration-150
            ease-in-out
            focus-within:bg-white
            focus-within:ring-2
            focus-within:ring-gray-300
            hover:bg-gray-200"
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
