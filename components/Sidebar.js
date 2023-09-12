import React from "react";
import {
  MicrophoneIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { selectItems as selectFavoritedItmes } from "../slices/favoritesSlice";
import { useSelector } from "react-redux";
import Image from "next/image";
import SidebarOption from "./SidebarOption";

function Sidebar() {
  const favoritedItems = useSelector(selectFavoritedItmes);

  return (
    <nav className=" flex xxs:flex-col xxs:h-screen py-3 xxs:py-0   border-t-2 xxs:border-t-0      bg-spotifyBlack items-center xxs:pt-4 xxs:border-r border-gray-600 ">
      {/*  <div
        onClick={() => window.open("https://www.spotify.com")}
        className="cursor-pointer relative h-[88px] w-[88px] rounded-full -mt-2.5"
      >
        <Image
          layout="fill"
          className="h-20/ /w-20 rounded-full "
          //src="https://baypark.ca/wp-content/uploads/2020/02/spotify-logo-png-spotify-music-app-icon-1024.jpg"
          src="/images/Spotify_Icon_CMYK_Green.png"
          alt="spotify-icon"
        />
      </div> */}

      <div className="hidden xxs:flex     flex-col items-center  mb-7 text-white font-dancing/ /font-serif">
        <h1 className={`text-lg font-bold`}>TrackTrends</h1>
        <h3 className={`font-extralight text-sm`}>by Peter</h3>
      </div>

      <hr className="hidden xxs:inline    border-gray-600 w-full mt-2/ mb-3 " />

      <div className="flex flex-1 justify-evenly     xxs:inline xxs:w-[184px] xxs:space-y-3 ">
        <SidebarOption Icon={UserIcon} url={"/"} title={"Profile"} />
        <SidebarOption
          Icon={MusicalNoteIcon}
          url={"/top-tracks"}
          title={"Top Tracks"}
        />
        <SidebarOption
          Icon={HeartIcon}
          url={"/favorited-tracks"}
          title={"Favorited"}
          favoritedItems={favoritedItems}
        />
        <SidebarOption
          Icon={MicrophoneIcon}
          url="/artists"
          title="Top Artists"
        />
        <SidebarOption Icon={GlobeAltIcon} url="/discover" title="Discover" />
      </div>
    </nav>
  );
}

export default Sidebar;
