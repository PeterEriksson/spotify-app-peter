import { Waveform, RaceBy } from "@uiball/loaders";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Song from "../../components/Song";
import useSpotify from "../../hooks/useSpotify";

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

  return (
    <div className="flex h-screen bg-gray-800 ">
      <Head>
        <title>Artist info</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <div className=" w-screen bg-gray-800  overflow-y-scroll">
        <Header backArrow />

        {loading ? (
          <div className="flex justify-center   mt-32">
            <RaceBy color="white" speed={1.5} size={150} lineWeight={4} />
          </div>
        ) : (
          <div className="mx-5 ">
            <div className=" relative justify-start items-center w-full h-72 flex  rounded-xl ">
              <Image
                onClick={() => console.log(artistTopSongs)}
                src={artist?.images[0]?.url}
                className="object-cover opacity-70  rounded-xl"
                layout="fill"
              />
              <div className="absolute text-white opacity-100 ml-3">
                <h1 className="text-4xl font-bold">{artist?.name}</h1>

                <div className="flex items-center space-x-1.5">
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
                <div className="flex space-x-1">
                  {artist?.genres?.map((genre, i) => (
                    <h4 key={i} className="text-sm italic ">
                      {genre}
                      {i !== artist?.genres?.length - 1 && ","}
                    </h4>
                  ))}
                </div>
              </div>
            </div>
            {/* popular songs */}
            <h1 className="text-white text-cente/r mt-3 text-xl">Popular</h1>
            {artistTopSongs?.tracks.slice(0, 5).map((track, i) => (
              <Song key={i} nr={i + 1} artistSong track={track} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { artistId } = params;
  return {
    props: {
      artistId,
    },
  };
}
