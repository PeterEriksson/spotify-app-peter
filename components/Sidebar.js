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
    <nav className="h-screen bg-spotifyBlack flex flex-col items-center pt-4 border-r border-gray-600        ">
      <div
        onClick={() => window.open("https://www.spotify.com")}
        className="cursor-pointer relative h-[88px] w-[88px] rounded-full -mt-2.5"
      >
        <Image
          layout="fill"
          className="h-20/ /w-20 rounded-full "
          // src="https://e7.pngegg.com/pngimages/158/639/png-clipart-spotify-streaming-media-logo-playlist-spotify-app-icon-logo-music-download-thumbnail.png"
          src="https://baypark.ca/wp-content/uploads/2020/02/spotify-logo-png-spotify-music-app-icon-1024.jpg"
          alt="spotify-logo"
        />
      </div>

      <hr className=" border-gray-600 w-full mt-2 mb-3 " />

      <div className="w-44// w-[184px] space-y-3     ">
        <SidebarOption Icon={UserIcon} url={"/"} title={"Profile"} />

        <SidebarOption
          Icon={MusicalNoteIcon}
          url={"/top-tracks"}
          title={"Top Tracks"}
        />

        <SidebarOption
          Icon={HeartIcon}
          url={"/liked-tracks"}
          title={"Liked Tracks"}
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
