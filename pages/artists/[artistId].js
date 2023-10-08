import { RaceBy } from "@uiball/loaders";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Song from "../../components/Song";
import useSpotify from "../../hooks/useSpotify";

import styles from "../../styles/effects.module.css";

export default function artistDetails({ artistId }) {
  const [artist, setArtist] = useState({});
  const [loading, setLoading] = useState(true);
  const [artistTopSongs, setArtistTopSongs] = useState([]);

  const spotifyApi = useSpotify();
  const getArtistInfo = () => {
    spotifyApi
      .getArtist(artistId)
      .then((data) => setArtist(data.body))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    //ux friendly - display loading indicator a bit longer
    setTimeout(() => {
      getArtistInfo();
    }, 1200);
  }, []);

  const getArtistTracks = () => {
    spotifyApi
      .getArtistTopTracks(artistId, "GB")
      .then((data) => setArtistTopSongs(data.body))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getArtistTracks();
  }, []);

  const [userIsFollowingArtist, SetUserIsFollowingArtist] = useState(false);
  const IsFollowingArtistCheck = () => {
    //onload issue, use getAccessToken()
    //if (spotifyApi.getAccessToken()) {
    spotifyApi
      .isFollowingArtists([artistId])
      .then((data) => SetUserIsFollowingArtist(data.body[0]))
      .catch((err) => console.log(err));
    //}
  };

  //onload issue...use settimeout
  useEffect(() => {
    setTimeout(() => {
      IsFollowingArtistCheck();
    }, 1000);
  }, []);

  //TEMP solution (see artistId)-> special render on [artistId].js, including Sidebar and Header
  return (
    <div className="flex  bg-bodyBackground flex-col-reverse xxs:flex-row   pageMobileHeaderTempSol">
      <Head>
        <title>TrackTrends | Artist info</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />

      <div
        className={`w-screen    h-screen    bg-bodyBackground overflow-y-scroll  /heart-interferes-with-scrollbar-> / $/{styles.hideScrollbar}   `}
      >
        <Header backArrow />

        {loading ? (
          <div className="flex justify-center   mt-32">
            <RaceBy color="white" speed={1.5} size={150} lineWeight={4} />
          </div>
        ) : (
          <div className="mx-5 ">
            <div className="flex justify-between items-center w-full ">
              <img
                onClick={() => console.log(artist)}
                className="object-contain w-2/5   xl:w-1/3"
                src={artist?.images[0]?.url}
                alt=""
              />
              <div className=" text-white w-min">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold ">
                  {artist?.name}
                </h1>

                <div className="flex items-center space-x-1.5 ">
                  <h4 className="font-bold text-lg"> {artist?.popularity}%</h4>
                  <p className="text-sm font-light">popularity</p>
                </div>

                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-lg">
                    {artist?.followers?.total.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </h4>
                  <p className="text-sm font-light">followers</p>
                </div>
                <div className="flex/ /flex-col /space-x-1   ">
                  {artist?.genres?.map((genre, i) => (
                    <h4 key={i} className="text-sm italic ">
                      {genre}
                    </h4>
                  ))}
                </div>

                <h3 className={`mb-1 `}>
                  {userIsFollowingArtist && "Following"}
                </h3>
                <img
                  onClick={() => window.open(artist?.external_urls?.spotify)}
                  className="h-[22px] mr-3 cursor-pointer"
                  src="../images/Spotify_Logo_CMYK_Green.png"
                  alt="spotify logo/icon"
                />
              </div>
            </div>

            <h2 className="text-white mt-3 text-xl">Popular</h2>
            {artistTopSongs?.tracks
              .slice(0, 5)
              .filter((track) => track.preview_url !== null)
              .map((track, i) => (
                <Song key={i} nr={i + 1} wideDesign track={track} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

//also pre-fetch session??
export async function getServerSideProps({ params }, context) {
  const { artistId } = params;
  //const session = await getSession(context);
  return {
    props: {
      artistId,
      //session,
    },
  };
}
