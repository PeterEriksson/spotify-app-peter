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

function Sidebar() {
  const router = useRouter();
  const { asPath } = useRouter();

  //display amount of favorited items in nice way.
  const favoritedItems = useSelector(selectFavoritedItmes);
  return (
    <nav className="h-screen bg-spotifyBlack flex flex-col items-center pt-4  ">
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
        <div className="sidebarDiv" onClick={() => router.push("/topTracks")}>
          <MusicalNoteIcon
            className={`sidebarIcon ${
              asPath === "/topTracks" ? "text-spotifyGreen" : "text-gray-400"
            } `}
          />
          <p
            className={`  ${
              asPath === "/topTracks" ? "text-spotifyGreen" : "text-gray-400"
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

        <div className="sidebarDiv">
          <HeartIcon className="sidebarIcon" />
          <p className="text-gray-400">Favorited tracks</p>
        </div>

        {/* discover */}
        <div className="sidebarDiv">
          <GlobeAltIcon className="sidebarIcon" />
          <p className="text-gray-400">Discover</p>
        </div>

        {/* search */}
        <div className="sidebarDiv">
          <MagnifyingGlassIcon className="sidebarIcon" />
          <p className="text-gray-400">Search</p>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
