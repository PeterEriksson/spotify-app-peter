import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  PauseIcon,
  /* PlayIcon, */
} from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import useSpotify from "../hooks/useSpotify";

function Body() {
  const { data: session } = useSession();
  console.log(session);

  const [recentSongs, setRecentSongs] = useState([]);

  const spotifyApi = useSpotify();
  useEffect(() => {
    //WebapiRegularError: An error occurred while communicating with Spotify's Web API.
    //Details: No token provided. -> do a check:  if (spotifyApi.getAccessToken()) ...
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyRecentlyPlayedTracks()
        .then((data) => setRecentSongs(data.body.items))
        .catch((err) => console.log(err));
    }
  }, []);

  //test ok..
  /* useEffect(() => {
    console.log(recentSongs);
  }, [recentSongs]); */

  return (
    <div className=" w-screen bg-gray-800  overflow-y-scroll">
      {/* GITHUB + LOGOUT (make component?) */}
      <div className="flex justify-end  text-white space-x-3 py-2 mr-5">
        <SocialIcon
          target="_blank"
          url="https://github.com/PeterEriksson/"
          bgColor="transparent"
          fgColor="#ffffff"
          className="!h-10 !w-10 transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer"
        />

        <button
          onClick={() => signOut()}
          className="space-x-1  transition duration-150 ease-in hover:opacity-50 flex items-center hover:cursor-pointer"
        >
          <ArrowLeftOnRectangleIcon className=" !h-7 !w-7" />
          <p className="text-sm">Logout</p>
        </button>
      </div>

      {/* BODY INFORMATION... */}
      <h1 className="text-3xl text-white flex justify-center items-center ">
        Hello {session?.user.name}
        <img
          //src="https://user-images.githubusercontent.com/17027312/134349999-06919dce-11f2-42b9-9c0c-2b27d8dcce51.jpeg"
          src={session?.user?.image}
          alt="profile dummy pic"
          className="h-10 w-10 rounded-full ml-2"
        />
      </h1>

      {/* SONGS */}
      {/* make into a component. Add isPlaying state */}
      <div className="space-y-3 mt-3 mx-3 grid grid-cols-1 lg:grid-cols-2  ">
        {recentSongs.map(({ track }, i) => (
          <div key={i} className="flex items-center space-x-3">
            <img
              className="h-14 w-14 "
              src={track.album.images[0]?.url}
              alt="previously played img"
            />
            <h3 className="text-lg font-base text-gray-300">{track?.name}</h3>
            <audio src={track?.preview_url} id={i} />
            <PlayIcon
              className="h-7 w-7 text-white cursor-pointer"
              onClick={() => document.getElementById(i).play()}
            />
            <PauseIcon
              className="h-7 w-7 text-white cursor-pointer"
              onClick={() => document.getElementById(i).pause()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Body;
