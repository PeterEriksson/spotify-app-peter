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
import useHeaderDisplay from "../hooks/useHeaderDisplay.js";

import styles from "../styles/effects.module.css";

function Header({ backArrow }) {
  const router = useRouter();

  const { headerVisible } = useHeaderDisplay();

  return (
    <header
      className={`bg-bodyBackground $//{styles.bodyBackground    z-[36] top-0 fixed  transform transition duration-500 ease-in-out   ${
        headerVisible ? "" : "translate-y-[-85%]"
      } w-full xxs:sticky border-b border-gray-500/60 xxs:border-0  py-1.5 xxs:py-2 shadow-2xl flex items-center justify-between  text-white px-4 
      } `}
    >
      <div className="flex flex-col items-center  ">
        {/* only show on artistId page */}
        <ArrowLeftIcon
          onClick={() => router.back()}
          className={`${
            !backArrow && "hidden"
          } cursor-pointer text-white mr-2 h-8 w-8 hover:opacity-70 transition duration-200 ease-in`}
        />

        {/* mobile: show app Logo (TrackTrends) except for when user is in [artistId]-page */}
        <h1
          aria-label="ignore-pause"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className={`${
            router.route == "/artists/[artistId]" && "hidden"
          } text-2xl py-2 xxs:hidden `}
        >
          TrackTrends
        </h1>
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
