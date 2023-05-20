import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { SocialIcon } from "react-social-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import styles from "../styles/tooltip.module.css";

function Header({ backArrow }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between  text-white py-2 px-5   test:-> z-50 sticky top-0 bg-gray-800   ">
      <div className="flex flex-col items-center font-dancing ">
        <ArrowLeftIcon
          onClick={() => router.back()}
          className={`${
            !backArrow && "hidden"
          } cursor-pointer text-white mr-2 h-8 w-8 hover:opacity-70 transition duration-200 ease-in`}
        />
        <h1 className={`${backArrow && "hidden"} text-lg font-bold`}>
          Spotify Stats
        </h1>
        <h3 className={`${backArrow && "hidden"} font-extralight text-sm`}>
          by Peter
        </h3>
      </div>

      <div className="space-x-2 flex items-center">
        <SocialIcon
          target="_blank"
          url="https://github.com/PeterEriksson/spotify-app-peter"
          bgColor="transparent"
          fgColor="#ffffff"
          data-tooltip-id="github"
          className="github     !h-11 !w-11 transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer    "
        />
        <Tooltip
          className={styles.header}
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
          className={styles.header}
          anchorSelect=".logOut"
          content="Log out"
        />
      </div>
    </div>
  );
}

export default Header;
