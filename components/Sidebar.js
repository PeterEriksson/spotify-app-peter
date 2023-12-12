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
    <nav className="sticky         z-[60] bottom-0 ModalInterfere:-> xxs:z-0     flex xxs:flex-col xxs:h-screen py-3 xxs:py-0   border-t-2 xxs:border-t-0      bg-spotifyBlack items-center xxs:pt-4 xxs:border-r border-gray-600 ">
      <div className="hidden xxs:flex     flex-col items-center  mb-7 text-white ">
        <h1 className={`text-lg font-bold`}>TrackTrends</h1>
        <h3 className={`font-extralight text-sm`}>by Peter</h3>
      </div>

      <hr className="hidden xxs:inline border-gray-600 w-full mt-2/ mb-3 " />

      <div className="flex justify-evenly xxs:inline xxs:w-[184px] xxs:cursor-pointer   flex-1 xxs:flex-initial ">
        <SidebarOption Icon={UserIcon} url={"/"} title={"Profile"} />
        <SidebarOption Icon={GlobeAltIcon} url="/discover" title="Discover" />
        <SidebarOption
          Icon={HeartIcon}
          url={"/favorited-tracks"}
          title={"Favorited"}
          favoritedItems={favoritedItems}
        />
        <SidebarOption
          Icon={MusicalNoteIcon}
          url={"/top-tracks"}
          title={"Top Tracks"}
        />
        <SidebarOption
          Icon={MicrophoneIcon}
          url="/artists"
          title="Top Artists"
        />
      </div>
    </nav>
  );
}

export default Sidebar;
