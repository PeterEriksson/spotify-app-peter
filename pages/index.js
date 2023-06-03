import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";

import { countries } from "country-data";
import Song from "../components/Song";

export default function profile() {
  const [profile, setProfile] = useState({});
  const [recentSongs, setRecentSongs] = useState([]);

  const [songsLimit, setSongsLimit] = useState(5);

  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const getProfileInfo = () => {
    spotifyApi
      .getMe()
      .then((data) => setProfile(data.body))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getProfileInfo();
  }, []);

  const getRecentSongs = () => {
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: songsLimit })
      .then((data) => setRecentSongs(data.body.items))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    //WebapiRegularError: An error occurred while communicating with Spotify's Web API.
    //Details: No token provided. -> do a check:  if (spotifyApi.getAccessToken()) ...
    //  if (spotifyApi.getAccessToken()) {
    getRecentSongs();
    //  }
  }, [songsLimit]);

  const [playlists, setPlaylists] = useState([]);
  const getMyPlaylists = () => {
    spotifyApi
      .getUserPlaylists(session?.user?.name)
      .then((data) => setPlaylists(data.body.items))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getMyPlaylists();
  }, []);

  return (
    <div className="flex h-screen ">
      <Head>
        <title>{session?.user?.name} | Spotify Stats </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className=" w-screen   overflow-y-scroll  !bg-bodyBackground">
        <Header />

        <div className="flex justify-between mx-5 bg-r mt-6 text-white items-center   ">
          <div className="flex items-center">
            <div className="relative h-[200px] w-[200px] rounded-full ">
              <Image
                layout="fill"
                className="h-20/ /w-20 rounded-full "
                src={session?.user?.image}
                //src="https://baypark.ca/wp-content/uploads/2020/02/spotify-logo-png-spotify-music-app-icon-1024.jpg"
                alt="spotify-logo"
              />
            </div>
            <div className="ml-6 ">
              <p className="text-sm  ">Profile</p>
              <h1
                onClick={() => console.log(profile)}
                className="text-4xl sm:text-5xl md:text-7xl font-bold  //mt-4"
              >
                {session?.user?.name}
              </h1>
              <p className="mt-2.5 text-sm">{profile?.product} user</p>

              <button
                className="p-2 sm:p-2.5 flex items-center border border-white rounded-lg mt-3 group relative transform transition duration-200 ease-in hover:scale-105"
                onClick={() => window.open(profile?.external_urls?.spotify)}
              >
                View Spotify
              </button>
            </div>
          </div>
          <div className="text-sm font-semibold   hidden md:inline">
            <p className="text-sm ">{countries[profile?.country]?.name}</p>
            <p className="">
              {profile?.followers?.total}{" "}
              {profile?.followers?.total == 1 ? "follower" : "followers"}
            </p>
            <p onClick={() => console.log(playlists)}>
              {playlists?.length} playlists
            </p>
          </div>
        </div>

        <hr className="border-[1.5px] border-gray-600  mx-5 my-4  " />
        <h2
          onClick={() => console.log(recentSongs)}
          className="text-white text-xl ml-5 mb-1"
        >
          Recently Played
        </h2>
        <div className="mx-5">
          {recentSongs
            ?.filter((track) => track.preview_url !== null)
            .map(({ track }, i) => (
              <Song key={i} nr={i + 1} wideDesign track={track} />
            ))}
        </div>

        {/* load more button */}
        {songsLimit < 15 && (
          <div className="flex justify-center">
            <button
              aria-label="ignore-pause"
              onClick={() => setSongsLimit((prev) => prev + 5)}
              className="text-gray-600 font-bold text-center my-2 cursor-pointer  "
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

//(when refreshing the page -> data is not shown. solution) ->
//onload issue -> pre-fetch the session / pre render the user -> data is shown.
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
