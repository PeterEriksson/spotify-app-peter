import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import React from "react";
import { SocialIcon } from "react-social-icons";

function Header() {
  return (
    <div className="flex justify-end  text-white space-x-2 py-2 mr-5     ">
      <SocialIcon
        target="_blank"
        url="https://github.com/PeterEriksson/spotify-app-peter"
        bgColor="transparent"
        fgColor="#ffffff"
        data-tooltip-content="Github"
        data-tooltip-id="github"
        className="github     !h-11 !w-11 transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer"
      />

      <button
        data-tooltip-content="Log out"
        data-tooltip-id="logOut"
        onClick={() => signOut()}
        className="logOut   transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer"
      >
        <ArrowLeftOnRectangleIcon className=" !h-7 !w-7" />
      </button>
    </div>
  );
}

export default Header;
