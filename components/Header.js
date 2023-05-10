import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import React from "react";
import { SocialIcon } from "react-social-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Header() {
  return (
    <div className="flex items-center justify-between  text-white py-2 mx-5  ">
      <div className="flex flex-col items-center font-dancing">
        <h1 className=" text-lg font-bold">Spotify Stats</h1>
        <h3 className="font-extralight text-sm">by Pete</h3>
      </div>

      <div className="space-x-2 flex items-center">
        <SocialIcon
          target="_blank"
          url="https://github.com/PeterEriksson/spotify-app-peter"
          bgColor="transparent"
          fgColor="#ffffff"
          /* data-tooltip-content="Github" */
          data-tooltip-id="github"
          className="github     !h-11 !w-11 transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer    "
        />
        <Tooltip
          className={` `}
          anchorSelect=".github"
          content="Github"
          delayShow={400}
        />

        <button
          data-tooltip-id="logOut"
          onClick={() => signOut()}
          className="logOut  transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer  "
        >
          <ArrowLeftOnRectangleIcon className=" !h-7 !w-7" />
        </button>
        <Tooltip
          delayShow={400}
          className={` `}
          anchorSelect=".logOut"
          content="Log out"
        />
      </div>
    </div>
  );
}

export default Header;
