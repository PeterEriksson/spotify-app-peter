import React from "react";
import {
  MicrophoneIcon,
  MusicalNoteIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { selectItems as selectFavoritedItmes } from "../slices/favoritesSlice";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Sidebar() {
  const router = useRouter();
  const { asPath } = useRouter();

  const { data: session } = useSession();

  const favoritedItems = useSelector(selectFavoritedItmes);
  return (
    <nav className="h-screen bg-spotifyBlack flex flex-col items-center pt-4  ">
      {/* <img
        className="rounded-full absolute object-cover z-10  h-9 w-9 left-28 top-6"
        src={session?.user?.image}
        alt="user-img"
      /> */}
      <div className="relative h-[88px] w-[88px] rounded-full -mt-2.5">
        <Image
          layout="fill"
          className="h-20/ /w-20 rounded-full "
          // src="https://e7.pngegg.com/pngimages/158/639/png-clipart-spotify-streaming-media-logo-playlist-spotify-app-icon-logo-music-download-thumbnail.png"
          src="https://baypark.ca/wp-content/uploads/2020/02/spotify-logo-png-spotify-music-app-icon-1024.jpg"
          alt="spotify-logo"
        />
        <img
          className="profile-img-tooltip cursor-pointer  rounded-full absolute object-cover z-10  h-9 w-9  top-3.5 -right-2 filter brightness-75 "
          src={session?.user?.image}
          alt="user-img"
          data-tooltip-id="user-img"
        />
        <Tooltip
          anchorSelect=".profile-img-tooltip"
          content={session?.user?.name}
          delayShow={300}
        />
      </div>

      {/* GRAY LINE */}
      <hr className=" border-gray-600 w-full mt-2 mb-3 " />

      <div className="w-48 space-y-3">
        {/* recently played */}
        <div className={`sidebarDiv  `} onClick={() => router.push("/")}>
          <ArrowPathIcon
            className={`sidebarIcon ${
              asPath === "/" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          />
          <p
            className={`${
              asPath === "/" ? "text-spotifyGreen" : "text-gray-400"
            }`}
          >
            Recently Played
          </p>
        </div>
        {/* top tracks */}
        <div className="sidebarDiv" onClick={() => router.push("/top-tracks")}>
          <MusicalNoteIcon
            className={`sidebarIcon ${
              asPath === "/top-tracks" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          />
          <p
            className={`  ${
              asPath === "/top-tracks" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          >
            Top Tracks
          </p>
        </div>
        {/* liked tracks */}
        <div
          className={`sidebarDiv relative   `}
          onClick={() => router.push("/liked-tracks")}
        >
          <HeartIcon
            className={`sidebarIcon ${
              asPath === "/liked-tracks" ? "text-spotifyGreen" : "text-gray-400"
            }`}
          />
          <p
            className={`text-gray-400 ${
              asPath === "/liked-tracks"
                ? "!text-spotifyGreen"
                : "text-gray-400"
            }`}
          >
            Liked tracks
          </p>
          <div
            className={`${
              favoritedItems == 0 && "hidden"
            } absolute top-0.5 left-7 rounded-full bg-red-500 h-[22px] w-[22px] flex items-center justify-center  `}
          >
            <p className={`text-sm text-white/75  `}>{favoritedItems.length}</p>
          </div>
        </div>

        {/* top artists */}
        <div className="sidebarDiv" onClick={() => router.push("/artists")}>
          <MicrophoneIcon
            className={`sidebarIcon ${
              asPath === "/artists" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          />
          <p
            className={` ${
              asPath === "/artists" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          >
            Top Artists
          </p>
        </div>

        {/* discover */}
        <div className="sidebarDiv">
          <GlobeAltIcon className="sidebarIcon" />
          <p className="text-gray-400">Discover</p>
        </div>

        {/* search */}
        {/* <div className="sidebarDiv">
          <MagnifyingGlassIcon className="sidebarIcon" />
          <p className="text-gray-400">Search</p>
        </div> */}
      </div>
    </nav>
  );
}

export default Sidebar;
