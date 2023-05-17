import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ClockIcon,
  InformationCircleIcon,
  PauseIcon,
  PlayIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import styles from "../styles/effects.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  selectItems as selectFavoritedItmes,
} from "../slices/favoritesSlice";
import Image from "next/image";
import useSpotify from "../hooks/useSpotify";
import { Audio as AudioPlayAnimation } from "react-loader-spinner";
import { convertMsToMinuteSecond } from "../utils/timeUtils.js";

function Song({ track, noPlay, artistSong, nr }) {
  const [audio, setAudio] = useState(new Audio(track?.preview_url));
  const [playing, setPlaying] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [triggerLikeEffect, setTriggerLikeEffect] = useState(false);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  const handleStopPlay = (e) => {
    //user has clicked a star of another song -> keep on playing
    /* ....enough with following line of code. Don't need to use ref to get the result we want. */
    if (e.target.getAttribute("aria-label") === "ignore-pause") return;
    //else stop
    setPlaying(false);
  };
  useEffect(() => {
    document.addEventListener("click", handleStopPlay, true);
    return () => {
      document.removeEventListener("click", handleStopPlay, true);
    };
  }, []);

  const dispatch = useDispatch();
  const favoritedItems = useSelector(selectFavoritedItmes);

  //test temp
  /* const spotifyApi = useSpotify();
  useEffect(() => {
    //works. Removes tracks that are already in Spotify saved songs. Use this later maybe.
    const unsub = () => {
      spotifyApi.containsMySavedTracks([track.id]).then(
        function (data) {
          // An array is returned, where the first element corresponds to the first track ID in the query
          var trackIsInYourMusic = data.body[0];

          if (trackIsInYourMusic) {
            console.log("Track was found in the user's Your Music library");
            dispatch(removeFromFavorites(track.id));
          } else {
            console.log("Track was not found.");
          }
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    };
    return unsub;
  }, []); */

  const handleLike = () => {
    //when in /likedTracks, animation retriggers when removing a like, -> solution->
    !noPlay && setTriggerLikeEffect(true);
    favoritedItems.every((item) => item.id !== track.id)
      ? dispatch(addToFavorites(track))
      : dispatch(removeFromFavorites(track.id));
    //console.log(favoritedItems);
  };

  const liked = () => {
    return favoritedItems.some((item) => item.id === track.id);
  };

  //return a "different" Song design
  if (artistSong) {
    return (
      <div className="text-white py-2 flex items-center justify-between //bg-red-400">
        <div className="flex items-center space-x-2">
          <p className="mr-1 ">{nr}</p>
          <img
            className="h-9 w-9 rounded-lg object-cover"
            src={track?.album?.images[0]?.url}
            alt=""
          />
          <h1 className="max-w-artistTopTrack truncate ">{track?.name}</h1>
          {/*  <p onClick={() => setPlaying(true)} className=" ">
            play
          </p> */}
          {playing ? (
            <PauseIcon
              className={`h-6 w-6 text-white/80 cursor-pointer    `}
              onClick={() => setPlaying(false)}
            />
          ) : (
            <PlayIcon
              className={`h-6 w-6 text-white/80 cursor-pointer   `}
              onClick={() => setPlaying(true)}
            />
          )}

          <div className={`${!playing && "hidden"}  ml-2 mb-1.5`}>
            <AudioPlayAnimation
              height="20"
              width="30"
              radius="9"
              color="gray"
              ariaLabel="play-animation"
              wrapperStyle
            />
          </div>
        </div>

        <div className="flex  items-center">
          <CalendarDaysIcon className="h-5 w-5 text-gray-300 hidden md:inline mr-1.5" />
          <p className="text-sm mr-3  hidden md:inline">
            {track?.album?.release_date}
          </p>

          <ClockIcon className="h-5 w-5 mr-1.5 text-gray-300 hidden lg:inline" />
          <p className="text-sm mr-3 lg:inline hidden">
            {convertMsToMinuteSecond(track?.duration_ms)}{" "}
          </p>
          <SparklesIcon className="h-5 w-5 text-gray-200 mr-1.5 " />
          <p className="text-sm ">{track?.popularity}%</p>
          <div
            aria-label="ignore-pause"
            onClick={handleLike}
            className={` ${liked() ? styles.heartRed : styles.heart}  ${
              !liked() && triggerLikeEffect && styles.animateUnlike
            }  ${liked() && triggerLikeEffect && styles.animate}  !-mr-4 `}
          />
        </div>
      </div>
    );
  } else {
    //if we don't recieve artistSong in props, return "normal" Song design
    return (
      <div className="bg-gray-700 rounded-xl border border-black/70 relative group  ">
        {/* DIV for centering play/pause */}
        <div className="relative flex items-center justify-center    h-40 w-full ">
          <Image
            className={`h-40// //w-full object-cover rounded-t-xl  
           group-hover:opacity-40
           transition duration-300 ease-in-out ${playing && "opacity-40"}  `}
            src={track?.album?.images[0]?.url}
            alt="song-image"
            layout="fill"
          />
          {noPlay && (
            <InformationCircleIcon
              onClick={() => setShowAdditionalInfo((prev) => !prev)}
              className="h-12 w-12 text-white cursor-pointer absolute mt-6 group-hover:-translate-y-4 group-hover:opacity-100   opacity-0  transition !duration-500 transform ease-in-out"
            />
          )}
          {playing ? (
            <>
              <PauseIcon
                className={`h-14 w-14 text-white cursor-pointer   absolute ${
                  noPlay && "hidden"
                } `}
                onClick={() => setPlaying(false)}
              />
              <div className="mt-auto ">
                <AudioPlayAnimation
                  height="40"
                  width="40"
                  radius="9"
                  color="gray"
                  ariaLabel="play-animation"
                  wrapperStyle
                />
              </div>
            </>
          ) : (
            <PlayIcon
              className={`h-14 w-14 text-white cursor-pointer  absolute  mt-6   group-hover:-translate-y-4 group-hover:opacity-100   opacity-0  transition !duration-500 transform ease-in-out ${
                noPlay && "hidden"
              } `}
              onClick={() => setPlaying(true)}
            />
          )}
        </div>

        <h2 className="text-bold text-white p-4">{track?.name}</h2>

        {/* gray line? + arrow? plus additional info (if noPlay..) */}
        <hr
          className={`-mt-2.5 mb-1 ${
            noPlay && showAdditionalInfo && "border-gray-600  mx-3"
          } ${!showAdditionalInfo && "hidden"} ${!noPlay && "hidden"}`}
        />

        <h3
          className={`text-sm px-4 text-white ${
            !showAdditionalInfo && "hidden"
          }`}
        >
          Artist: {track?.artists[0]?.name}
        </h3>
        <h3
          className={`text-sm px-4 pb-1 text-white truncate ${
            !showAdditionalInfo && "hidden"
          }`}
        >
          Album: {track?.album?.name}
        </h3>
        {/* HEART ICON DIV */}
        <div
          aria-label="ignore-pause"
          onClick={handleLike}
          className={` absolute -top-1.5 -left-1.5  ${
            liked() ? styles.heartRed : styles.heart
          }  ${!liked() && triggerLikeEffect && styles.animateUnlike}  ${
            liked() && triggerLikeEffect && styles.animate
          }   `}
        />
      </div>
    );
  }
}

export default Song;
