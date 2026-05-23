import { Input, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import ProfilePlaceholder from "../assets/provile.svg";

export default function Navbar() {
  let navigate = useNavigate();

  return (
    <div className="navbar bg-dark flex flex-row justify-between">
      <div id="left" className="flex flex-row" >
        <div
          id="home-link"
          className="flex items-center bg-bold-1 pl-3 pr-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Typography className="text-tb1">
            Home
          </Typography>
        </div>
        <div
          id="articleslist-link"
          className="flex items-center bg-bold-2 pl-3 pr-3 cursor-pointer"
          onClick={() => navigate("/articleList")}
        >
          <Typography className="text-tb2">
            Articles
          </Typography>
        </div>
      </div>
      <div id="right" className="flex flex-row bg-neutral-3 flex flex-row">
        <div id="search-bar" className="flex items-center pl-3 pr-3">
          <Input />
        </div>
        <div
          id="profile-link"
          className="flex items-center bg-bold-3 pl-3 pr-3 cursor-pointer"
          onClick={() => navigate("/profile/testUser")}
        >
          <img src={ProfilePlaceholder} alt="Profile Picture" style={{ height: "2.3rem" }} />
        </div>
      </div>
    </div>
  );
};
