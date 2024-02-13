import { ArrowRightCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { RaceBy, DotPulse } from "@uiball/loaders";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Artist from "../components/Artist";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Song from "../components/Song";
import useSpotify from "../hooks/useSpotify";
import styles from "../styles/effects.module.css";

export default function discover() {
  const spotifyApi = useSpotify();

  const [topArtists, setTopArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [artistsSelected, setArtistsSelected] = useState([]);
  const [popularity, setPopularity] = useState(0);
  const [danceability, setDanceability] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const recommendationsContainerRef = useRef(null);
  const artistsContainerRef = useRef(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setLoadingArtists(true);
      //increase loading-spinner time -> more ux friendly
      setTimeout(() => {
        //getArtists();
        spotifyApi
          .getMyTopArtists({ limit: 14, time_range: "long_term" })
          .then((data) => setTopArtists(data.body.items))
          .then(() => setLoadingArtists(false))
          .catch((err) => console.log(err));
      }, 500);
    }
  }, []);

  /* input range */
  const handlePopularityChange = (event) => {
    const newPopularity = Math.round(event.target.value / 10) * 10;
    setPopularity(newPopularity);
  };
  const handleDanceabilityChange = (event) => {
    const newDanceability = Math.round(event.target.value / 10) * 10;
    setDanceability(newDanceability);
  };

  const handleGetRecommendations = () => {
    //(weird bug fix (fetching recommendations when song is playing))
    setRecommendations([]);

    setLoadingRecommendations(true);
    // increase loading time
    setTimeout(() => {
      spotifyApi
        .getRecommendations({
          seed_artists: artistsSelected,
          min_popularity: popularity,
          min_danceability: danceability / 100,
          limit: 15,
        })
        .then((data) => {
          setRecommendations(data?.body?.tracks);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoadingRecommendations(false);
        });
    }, 700);
  };

  //automatic scroll down after displaying recommendations
  useEffect(() => {
    recommendations.length > 0 &&
      recommendationsContainerRef?.current?.scrollIntoView({
        behavior: "smooth",
        //start,center,end,nearest
        block: "start",
      });
  }, [recommendations]);

  // const handleArrowClick = (scrollOffset) => {
  //   artistsContainerRef.current.scrollTo({
  //     left: artistsContainerRef.current.scrollLeft + scrollOffset,
  //     behavior: "smooth",
  //   });
  // };

  const buttonNotAvailable = () => {
    if (artistsSelected.length == 0 || loadingRecommendations) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      className={`MobileScreenFix:->    ${
        (recommendations?.length == 0 || loadingRecommendations) && "h-screen"
      } pageMobileHeaderTempSol `}
    >
      <Head>
        <title> TrackTrends: Discover </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loadingArtists ? (
        <div className="flex justify-center  mt-28">
          <RaceBy color="white" speed={1.2} size={150} lineWeight={4} />
        </div>
      ) : (
        <>
          <h1
            onClick={() => console.log(topArtists)}
            aria-label="ignore-pause"
            className=" mt-1.5 text-2xl text-white/50 text-center uppercase tracking-tight"
          >
            Discover
          </h1>
          <h3 className="relative text-white w-fit mx-auto mb-1 text-base flex items-center ">
            Select up to 3 artists{" "}
            {artistsSelected.length > 0 && (
              <div className="absolute -right-12 flex items-center text-white/50 ">
                <p> ({artistsSelected.length}) </p>
                <TrashIcon
                  className="h-4 w-4 text-white/50 ml-0.5 cursor-pointer"
                  onClick={() => setArtistsSelected([])}
                />
              </div>
            )}
          </h3>

          <div className="relative  flex justify-end items-center ">
            <div
              ref={artistsContainerRef}
              className={` $//{styles.hideScrollbar} flex overflow-x-scroll space-x-2  lg:mx-5 mx-5 lg:grid lg:grid-cols-7 lg:gap-1 lg:space-x-0   `}
            >
              {topArtists?.map((artist, i) => (
                <Artist
                  key={i}
                  artist={artist}
                  discoverPage
                  artistsSelected={artistsSelected}
                  setArtistsSelected={setArtistsSelected}
                />
              ))}
              {/* fading edge testing */}
              <div
                className={`hidden absolute h-full bg-gradient-to-r from-cardBackground/10 to-bodyBackground  right-5 w-10 pointer-events-none z-[35]  `}
              />
            </div>
            {/* <ArrowRightCircleIcon
              onClick={() => handleArrowClick(250)}
              className="text-white lg:hidden absolute  h-8// w-8// h-5 w-5   z-10 mr-0.5 cursor-pointer "
            /> */}
          </div>

          {/* INPUT RANGE DIV */}
          <div className="mx-5 flex space-x-5 justify-between mt-3">
            <div className="text-center  w-full">
              <input
                type="range"
                min="0"
                max="100"
                value={popularity}
                onChange={handlePopularityChange}
                className={`${styles.rangeInput} bg-gray-700 `}
              />
              <p className="mt-2 text-lg text-gray-700 ">
                Min Popularity: {popularity}
              </p>
            </div>

            <div className="text-center w-full">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={danceability}
                onChange={handleDanceabilityChange}
                className={`${styles.rangeInput} bg-gray-700    `}
              />
              <p className="mt-2 text-lg text-gray-700">
                Min Danceability: {danceability}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              disabled={buttonNotAvailable()}
              onClick={handleGetRecommendations}
              className={`${
                buttonNotAvailable() && "opacity-70"
              } bg-spotifyGreen  text-white border border-spotifyBlack rounded-3xl p-4/     w-52 h-14 flex justify-center items-center `}
            >
              {loadingRecommendations ? (
                <DotPulse /* size={150} */ speed={0.9} color="white" />
              ) : (
                "Get Recommendations"
              )}
            </button>
          </div>

          <div
            ref={recommendationsContainerRef}
            className="   !mx-4 gap-3 my-3 grid grid-cols-1 xs:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 lg:!mx-auto lg:px-2 max-w-6xl  "
          >
            {recommendations
              //error issue: some tracks dont have preview_url -> solution, filter out->
              ?.filter((track) => track.preview_url !== null)
              .map((_track, i) => (
                <Song key={i} track={_track} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

//(when refreshing the page -> data is not shown. solution)
//onload issue -> pre-fetch the session / pre render the user -> data is shown.
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
