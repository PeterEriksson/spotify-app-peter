import React from "react";
import {
  MicrophoneIcon,
  MusicalNoteIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();
  const { asPath } = useRouter();
  return (
    <div className="h-screen bg-spotifyBlack flex flex-col items-center pt-4  ">
      <img
        className="h-20 w-20 rounded-full bg-transparent"
        src="https://e7.pngegg.com/pngimages/158/639/png-clipart-spotify-streaming-media-logo-playlist-spotify-app-icon-logo-music-download-thumbnail.png"
        alt="spotofy logo"
      />
      {/* GRAY LINE */}
      <hr className=" border-gray-600 w-full mt-3 mb-3 " />

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
        <div className="sidebarDiv" onClick={() => router.push("/tracks")}>
          <MusicalNoteIcon
            className={`sidebarIcon ${
              asPath === "/tracks" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          />
          <p
            className={`  ${
              asPath === "/tracks" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          >
            Top Tracks
          </p>
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

        <div className="sidebarDiv">
          <StarIcon className="sidebarIcon" />
          <p className="text-gray-400">Starred tracks</p>
        </div>

        {/* search */}
        <div className="sidebarDiv">
          <MagnifyingGlassIcon className="sidebarIcon" />
          <p className="text-gray-400">Search</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
