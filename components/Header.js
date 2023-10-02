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
    <header className="py-1.5 xxs:py-2  flex items-center justify-between  text-white mx-4  bg-bodyBackground  ">
      <div className="flex flex-col items-center  ">
        <ArrowLeftIcon
          onClick={() => router.back()}
          className={`${
            !backArrow && "hidden"
          } cursor-pointer text-white mr-2 h-8 w-8 hover:opacity-70 transition duration-200 ease-in`}
        />
        {
          //show app Logo (TrackTrends) except for when user is in [artistId]-page -> ArrowLeftIcon displayed.
          //remove backArrow prop.....
          router.route !== "/artists/[artistId]" && (
            <h1 className={`font-dancing/ text-xl xxs:hidden `}>TrackTrends</h1>
          )
        }
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
          noArrow
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
          noArrow
        />
      </div>
    </header>
  );
}

export default Header;
