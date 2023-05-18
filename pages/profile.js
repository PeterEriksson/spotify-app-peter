import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";

export default function profile() {
  const [profile, setProfile] = useState({});

  /* data to show... inspiration...->
  getUserPlaylists. "13 public playlists"
  getFollowedArtists 
  getRecommendations -> In Profile or Discover?

  Followers
  button below: View Spotify profile (external_urls?.spotify)
  */

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
  return (
    <div className="flex h-screen ">
      <Head>
        <title>{session?.user?.name} | Spotify Stats </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className=" w-screen bg-gray-800  overflow-y-scroll">
        <Header />

        <h1
          onClick={() => console.log(profile)}
          className="text-3xl text-white text-center  tracking-wide"
        >
          {session?.user?.name} test obj..
        </h1>
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
