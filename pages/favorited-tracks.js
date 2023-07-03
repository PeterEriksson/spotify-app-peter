import {
  ArrowLeftOnRectangleIcon,
  ListBulletIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Head from "next/head";

import React, { useEffect, useState, Fragment, useRef } from "react";
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
import useSpotify from "../hooks/useSpotify";

import { Dialog, Transition } from "@headlessui/react";
import modalstyles from "../styles/effects.module.css";

import toast, { Toaster } from "react-hot-toast";
import SongExtended from "../components/SongExtended";

function favoritedTracks() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const favoritedItems = useSelector(selectFavoritedItmes);

  const dispatch = useDispatch();
  const clearFavorites = () => {
    dispatch(emptyFavorites());
  };

  const handlePlusClick = () => {
    setOpenNewPlaylistModal((prev) => !prev);
  };

  const [openNewPlaylistModal, setOpenNewPlaylistModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const [playlistName, setPlaylistName] = useState("");

  const playlistInputRef = useRef();
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);

    if (event.target.value === "option2") {
      //fixes small bug...->
      setTimeout(() => {
        playlistInputRef.current.focus();
      }, 50);
    }
  };

  const actionNotAllowed = () => {
    return (
      (playlistName.length >= 100 && selectedOption == "option2") ||
      favoritedItems.length == 0 ||
      (playlistName == "" && selectedOption !== "option1") ||
      (!playlistName.trim() && selectedOption !== "option1") ||
      selectedOption == "" ||
      loadingAction
    );
  };

  const [loadingAction, setLoadingAction] = useState(false);

  const handleAction = () => {
    if (selectedOption == "option1") {
      setLoadingAction(true);
      setOpenNewPlaylistModal(false);
      const notificationAdd = toast.loading(
        `Adding ${favoritedItems.length > 1 ? "songs" : "song"}`,
        {
          style: {
            background: "#191414",
            color: "#1DB954",
            fontWeight: "bold",
            fontSize: "17px",
            padding: "20px",
          },
        }
      );

      //add extra loading time -> ux friendly
      setTimeout(() => {
        spotifyApi
          .addToMySavedTracks(favoritedItems.map((item) => item.id))
          .then(() => {
            toast.success(
              `Song${
                favoritedItems.length > 1 ? "s" : ""
              } added to your liked on Spotify!`,
              {
                id: notificationAdd,
                duration: 3300,
                style: {
                  background: "#191414",
                  color: "#1DB954",
                  fontWeight: "bold",
                  fontSize: "17px",
                  padding: "20px",
                },
              }
            );
          })
          .then(dispatch(emptyFavorites()))
          .catch((err) => {
            console.log(err);
            toast("ERROR, something went wrong", {
              id: notificationAdd,
              duration: 3500,
              style: {
                background: "red",
                color: "white",
                fontWeight: "bolder",
                fontSize: "17px",
                padding: "20px",
              },
            });
          })
          .finally(() => {
            setLoadingAction(false);
            setSelectedOption("");
            setPlaylistName("");
          });
      }, 1200);
    }

    if (selectedOption == "option2") {
      //first we create a playlist, then we grab hold of the id of that playlist
      //in order to use addTracksToPlaylist
      setLoadingAction(true);
      setOpenNewPlaylistModal(false);
      const notificationCreate = toast.loading(`Creating Playlist...`, {
        style: {
          background: "#191414",
          color: "#1DB954",
          fontWeight: "bold",
          fontSize: "17px",
          padding: "20px",
        },
      });

      spotifyApi
        .createPlaylist(playlistName, {
          description: "",
          public: false,
          collaborative: false,
        })
        .then((data) =>
          spotifyApi.addTracksToPlaylist(
            data.body.id,
            favoritedItems.map((item) => `spotify:track:${item.id}`)
          )
        )
        .then(dispatch(emptyFavorites()))
        .then(() => {
          toast.success(`${playlistName} playlist created!`, {
            id: notificationCreate,
            duration: 4000,
            style: {
              background: "#191414",
              color: "#1DB954",
              fontWeight: "bold",
              fontSize: "17px",
              padding: "20px",
            },
          });
        })
        .catch((err) => {
          console.log(err);
          toast("ERROR, something went wrong", {
            id: notificationCreate,
            duration: 3500,
            style: {
              background: "red",
              color: "white",
              fontWeight: "bolder",
              fontSize: "17px",
              padding: "20px",
            },
          });
        })
        .finally(() => {
          setLoadingAction(false);
          setPlaylistName("");
          setSelectedOption("");
        });
    }
  };

  return (
    <div className="flex h-screen ">
      <Head>
        <title>TrackTrends: Favorited Songs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />

      <div className=" w-screen bg-bodyBackground  overflow-y-scroll   ">
        <Toaster position="top-center" />
        <Header />

        <h1 className="text-3xl text-white text-center uppercase tracking-wide">
          favorited songs
        </h1>
        <h3 className="text-base text-white text-center mx-2">
          Add tracks to your liked on Spotify or create a new playlist
        </h3>

        {/* MODAL -> own component? */}
        <Transition.Root show={openNewPlaylistModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-50 inset-0 //overscroll-y-auto overflow-y-auto"
            onClose={setOpenNewPlaylistModal}
          >
            <div className="flex items-center justify-center min-h-[800px]/ sm: min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <span
                aria-label="trick browser to center the modal contents...-> "
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-1.5  pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                  <div className="mt-1  flex flex-col items-center sm:mt-3.5">
                    <Dialog.Title
                      as="h1"
                      className="text-lg text-center underline// leading-6 font-medium text-gray-900"
                    >
                      Perform action with liked song
                      {(favoritedItems.length > 1 ||
                        favoritedItems.length == 0) &&
                        "s"}
                    </Dialog.Title>

                    <div className="flex flex-col  mt-1.5  ">
                      <label className={modalstyles.radioLabel}>
                        <input
                          color="#191414"
                          className="mr-1"
                          type="radio"
                          value="option1"
                          checked={selectedOption === "option1"}
                          onChange={handleOptionChange}
                        />
                        Add song
                        {(favoritedItems.length > 1 ||
                          favoritedItems.length == 0) &&
                          "s"}{" "}
                        to your liked on Spotify
                      </label>
                      <label className={modalstyles.radioLabel}>
                        <input
                          className="mr-1 "
                          type="radio"
                          value="option2"
                          checked={selectedOption === "option2"}
                          onChange={handleOptionChange}
                        />
                        Create new playlist on Spotify
                      </label>
                    </div>
                    <div className="relative mt-3 rounded-md ">
                      <div className="absolute z-30 inset-y-0 pl-3 flex items-center pointer-events-none ">
                        <ListBulletIcon className="h-5 w-5 text-gray-500 " />
                      </div>
                      <input
                        disabled={selectedOption == "option1"}
                        ref={playlistInputRef}
                        type="text"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className={`${
                          selectedOption == "option1" && "cursor-not-allowed"
                        } ${
                          selectedOption == "option1" &&
                          "line-through opacity-60"
                        }   bg-gray-50 px-12 py-1.5 focus:outline-none focus:border-gray-400 border w-full    block sm:text-sm  rounded-md`}
                        placeholder="Playlist name"
                      />
                    </div>
                    <button
                      onClick={handleAction}
                      disabled={actionNotAllowed()}
                      className={`${
                        actionNotAllowed() && "opacity-50"
                      }  text-white rounded-xl bg-spotifyGreen px-4 py-2  mt-5   `}
                    >
                      {selectedOption == "" && "select option"}
                      {selectedOption == "option1" &&
                        `Add Song${
                          favoritedItems.length > 1 ||
                          favoritedItems.length == 0
                            ? "s"
                            : ""
                        }`}
                      {selectedOption == "option2" && "Create Playlist"}
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        {/* END OF MODAL */}

        <button
          //onClick={() => console.log(favoritedItems.map((item) => item.id))}
          //onClick={() =>  spotifyApi.addToMySavedTracks(favoritedItems.map((item) => item.id))}
          onClick={handlePlusClick}
          data-tooltip-id="create"
          className={`connectingToTooltip: create ${
            favoritedItems.length > 0 && "hover:scale-105"
          } 
             absolute z-20 bottom-4 right-4 rounded-full p-4 bg-spotifyGreen transform transition duration-200 ease-in  `}
        >
          <PlusIcon className="h-9 w-9 text-white" />
        </button>

        <TrashIcon
          onClick={() => dispatch(emptyFavorites())}
          data-tooltip-id="trash"
          className={` trash ${
            favoritedItems == 0 && "hidden"
          } //bg-spotifyBlack //rounded-full  h-8 w-8 absolute cursor-pointer z-30 bottom-7 ml-4 text-white transform transition duration-200 ease-in hover:scale-105`}
        />
        <Tooltip
          content="Clear all songs"
          className={`${styles.bottomButton}`}
          anchorSelect=".trash"
          delayShow={300}
        />

        <div className="!mx-5 gap-3 my-3 grid grid-cols-1 xs:grid-cols-2  md:grid-cols-3 mdlg:grid-cols-4 lg:grid-cols-5 lg:mx-auto lg:px-2 max-w-4xl ">
          {favoritedItems.map((track, i) => (
            //<Song key={i} track={track} noPlay />
            <SongExtended key={i} track={track} noPlay />
          ))}
        </div>
      </div>
    </div>
  );
}

export default favoritedTracks;

//onload issue -> pre-fetch the session / pre render the user ->
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
