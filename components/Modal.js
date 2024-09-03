import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { emptyFavorites } from "../slices/favoritesSlice";
import useSpotify from "../hooks/useSpotify";
import modalstyles from "../styles/effects.module.css";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ListBulletIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

function Modal({
  openNewPlaylistModal,
  setOpenNewPlaylistModal,
  favoritedItems,
}) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const playlistInputRef = useRef();
  const spotifyApi = useSpotify();

  const dispatch = useDispatch();
  const clearFavorites = () => {
    dispatch(emptyFavorites());
  };

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
      (playlistName.length >= 50 && selectedOption == "option2") ||
      favoritedItems.length == 0 ||
      playlistDescription.length >= 100 ||
      (playlistName == "" && selectedOption !== "option1") ||
      (!playlistName.trim() && selectedOption !== "option1") ||
      selectedOption == "" ||
      loadingAction
    );
  };

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
            setPlaylistDescription("");
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
          description: playlistDescription,
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
          setPlaylistDescription("");
          setSelectedOption("");
        });
    }
  };

  return (
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
                  Manage favorited song
                  {(favoritedItems.length > 1 || favoritedItems.length == 0) &&
                    "s"}
                </Dialog.Title>

                <div className="flex flex-col  mt-1.5  ">
                  <label className={`${modalstyles.radioLabel} cursor-pointer`}>
                    <input
                      id="addToLikedRadioBtn"
                      color="#191414"
                      className="mr-1 "
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
                  <label className={`${modalstyles.radioLabel} cursor-pointer`}>
                    <input
                      id="newPlayListRadioBtn"
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
                  <div
                    className={`absolute z-30 inset-y-0 pl-3 pointer-events-none    mt-[9px] sm:mt-[7px]   `}
                  >
                    <ListBulletIcon className="h-5 w-5 text-gray-500 " />
                  </div>

                  <input
                    id="playListNameInput"
                    disabled={selectedOption == "option1"}
                    ref={playlistInputRef}
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className={`${
                      selectedOption == "option1" && "cursor-not-allowed"
                    } ${
                      selectedOption == "option1" && "line-through opacity-60"
                    }   bg-gray-50 px-12 py-1.5 focus:outline-none focus:border-gray-400 border w-full    block sm:text-sm  rounded-md`}
                    placeholder="Playlist name"
                  />

                  {selectedOption == "option2" && (
                    <>
                      <div
                        className={`absolute z-30 inset-y-0 pl-3 pointer-events-none    mt-[54px] sm:mt-[48px]   `}
                      >
                        <PencilSquareIcon className="h-5 w-5 text-gray-500 opacity-80 " />
                      </div>
                      <input
                        id="playListDescriptionInput"
                        type="text"
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        className={`${
                          selectedOption == "option1" && "hidden"
                        }  mt-2 bg-gray-50 px-12 py-1.5 focus:outline-none focus:border-gray-400 border w-full    block sm:text-sm  rounded-md`}
                        placeholder="Description (optional)"
                      />
                    </>
                  )}
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
                      favoritedItems.length > 1 || favoritedItems.length == 0
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
  );
}

export default Modal;
