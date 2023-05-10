import {
  ArrowLeftOnRectangleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Head from "next/head";
import React from "react";
import { SocialIcon } from "react-social-icons";
import { Tooltip } from "react-tooltip";
import Sidebar from "../components/Sidebar";
import styles from "../styles/tooltip.module.css";
import Header from "../components/Header";
import Song from "../components/Song";
import { useDispatch, useSelector } from "react-redux";
import { selectItems as selectFavoritedItmes } from "../slices/favoritesSlice";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { emptyFavorites } from "../slices/favoritesSlice";

function likedTracks() {
  const { data: session } = useSession();

  const favoritedItems = useSelector(selectFavoritedItmes);

  const dispatch = useDispatch();
  const clearFavorites = () => {
    dispatch(emptyFavorites());
  };

  return (
    <div className="flex h-screen bg-gray-800">
      <Head>
        <title>Liked Songs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />

      <div className=" w-screen bg-gray-800  overflow-y-scroll   ">
        <Header />

        <h3 className="text-3xl text-white text-center uppercase tracking-wide">
          liked songs
        </h3>

        <button
          data-tooltip-id="create"
          data-tooltip-content={`${
            favoritedItems.length == 0
              ? "Add songs & create a playlist!"
              : "Create playlist with liked songs"
          } `}
          className={`connectingToTooltip: create ${
            favoritedItems.length > 0 && "hover:scale-105"
          } 
             absolute z-20 bottom-4 right-4 rounded-full p-4 bg-spotifyGreen transform transition duration-200 ease-in  `}
        >
          <PlusIcon className="h-9 w-9 text-white" />
        </button>
        <Tooltip
          className={`${styles.bottomButton} `}
          anchorSelect=".create"
          place="top"
        />

        <TrashIcon
          onClick={() => dispatch(emptyFavorites())}
          data-tooltip-content={`Clear all songs`}
          data-tooltip-id="trash"
          className={` trash ${
            favoritedItems == 0 && "hidden"
          }  h-8 w-8 absolute cursor-pointer z-30 bottom-7 ml-3 text-white transform transition duration-200 ease-in hover:scale-105`}
        />
        <Tooltip className={`${styles.bottomButton}`} anchorSelect=".trash" />

        <div className="gap-3 my-3 grid grid-cols-1 xs:grid-cols-2  md:grid-cols-4 lg:grid-cols-5 lg:mx-auto lg:px-2 max-w-4xl mx-3 ">
          {favoritedItems.map((track, i) => (
            <Song key={i} track={track} noPlay />
          ))}
        </div>
      </div>
    </div>
  );
}

export default likedTracks;

//onload issue -> pre-fetch the session / pre render the user ->
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
