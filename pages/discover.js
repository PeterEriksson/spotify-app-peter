import { ArrowRightCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { RaceBy, Waveform } from "@uiball/loaders";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Artist from "../components/Artist";
import ArtistExtended from "../components/ArtistExtended";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Song from "../components/Song";
import SongExtended from "../components/SongExtended";
import useSpotify from "../hooks/useSpotify";

import styles from "../styles/effects.module.css";

export default function discover() {
  const spotifyApi = useSpotify();

  const [topArtists, setTopArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [artistsSelected, setArtistsSelected] = useState([]);

  const getArtists = () => {
    spotifyApi
      .getMyTopArtists({ limit: 14, time_range: "long_term" })
      .then((data) => setTopArtists(data.body.items))
      .then(() => setLoadingArtists(false))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setLoadingArtists(true);
      //increase loading-spinner time -> more ux friendly
      setTimeout(() => {
        getArtists();
      }, 500);
    }
  }, []);

  /* input range */
  const [popularity, setPopularity] = useState(0);
  const handlePopularityChange = (event) => {
    const newPopularity = Math.round(event.target.value / 10) * 10;
    setPopularity(newPopularity);
  };
  const [danceability, setDanceability] = useState(0);
  const handleDanceabilityChange = (event) => {
    const newDanceability = Math.round(event.target.value / 10) * 10;
    setDanceability(newDanceability);
  };

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  // increase loading time..?
  const handleGetRecommendations = () => {
    setLoadingRecommendations(true);
    spotifyApi
      .getRecommendations({
        min_danceability: danceability / 100,
        seed_artists: artistsSelected,
        min_popularity: popularity,
        limit: 15,
      })
      .then((data) => setRecommendations(data.body.tracks))
      .then(() => setLoadingRecommendations(false))
      .catch((err) => console.log(err));
  };

  const containerRef = useRef(null);

  const handleArrowClick = (scrollOffset) => {
    containerRef.current.scrollTo({
      left: containerRef.current.scrollLeft + scrollOffset,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex h-screen ">
      <Head>
        <title> TrackTrends: Discover </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className=" w-screen   overflow-y-scroll  bg-bodyBackground">
        <Header />

        {loadingArtists ? (
          <div className="flex justify-center  mt-28">
            <RaceBy color="white" speed={1.2} size={150} lineWeight={4} />
          </div>
        ) : (
          <>
            <h1
              aria-label="ignore-pause"
              //onClick={() => console.log(recommendations)}
              className="text-3xl mt-1.5 text-white text-center uppercase tracking-wide"
            >
              Discover
            </h1>
            <h3 className="relative text-white w-fit mx-auto mb-1 text-base flex items-center ">
              Select up to 3 artists{" "}
              {artistsSelected.length > 0 && (
                <div className="absolute -right-12 flex items-center ">
                  <p> ({artistsSelected.length}) </p>
                  <TrashIcon
                    className="h-4 w-4 text-white/90 ml-0.5 cursor-pointer"
                    onClick={() => setArtistsSelected([])}
                  />
                </div>
              )}
            </h3>

            <div className="relative  flex justify-end items-center ">
              <div
                ref={containerRef}
                className={`     ${styles.hideScrollbar} flex  overflow-x-scroll space-x-2   lg:mx-5 mx-7 lg:grid lg:grid-cols-7 lg:gap-1 lg:space-x-0          `}
              >
                {topArtists.map((artist, i) => (
                  //<Artist
                  //key={i}
                  //artist={artist}
                  //discoverPage
                  //artistsSelected={artistsSelected}
                  //setArtistsSelected={setArtistsSelected}
                  ///>
                  <ArtistExtended
                    key={i}
                    artist={artist}
                    discoverPage
                    artistsSelected={artistsSelected}
                    setArtistsSelected={setArtistsSelected}
                  />
                ))}
              </div>

              <ArrowRightCircleIcon
                onClick={() => handleArrowClick(250)}
                className="text-white lg:hidden absolute  h-8// w-8// h-5 w-5   z-10 mr-0.5 cursor-pointer "
              />
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
                disabled={artistsSelected.length == 0}
                onClick={handleGetRecommendations}
                className=" text-white border border-white rounded-xl px-3 py-2  "
              >
                Get Recommendations
              </button>
            </div>

            {loadingRecommendations ? (
              <div className="flex justify-center mt-4">
                <Waveform color="white" speed={0.8} />
              </div>
            ) : (
              <div className="!mx-4 gap-3 my-3 grid grid-cols-1 xs:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 lg:!mx-auto lg:px-2 max-w-6xl  ">
                {recommendations
                  //error issue: some tracks dont have preview_url -> solution, filter out->
                  ?.filter((track) => track.preview_url !== null)
                  .map((_track, i) => (
                    //<Song key={i} track={_track} />
                    <SongExtended key={i} track={_track} />
                  ))}
              </div>
            )}
          </>
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
