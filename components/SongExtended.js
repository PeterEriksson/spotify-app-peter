import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ClockIcon,
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

function SongExtended({ track, noPlay, wideDesign, nr }) {
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

  const handleLike = () => {
    //when  in /favorited-tracks, animation retriggers when removing a like, -> solution->
    !noPlay && setTriggerLikeEffect(true);
    //if song isn't liked -> add. else -> remove
    favoritedItems.every((item) => item.id !== track.id)
      ? dispatch(addToFavorites(track))
      : dispatch(removeFromFavorites(track.id));
  };

  const liked = () => {
    return favoritedItems.some((item) => item.id === track.id);
  };

  //return WIDE Song design (wideDesign/Profile:recentlyPlayed)
  if (wideDesign) {
    return (
      <>
        <div className="text-white py-1.5 flex items-center justify-between ">
          <div className="flex items-center space-x-1.5 sm:space-x-2 mdlg:space-x-4 lg:space-x-5">
            <p className="mr-1 ">{nr}</p>
            <img
              className="h-9 w-9 rounded-lg/ object-contain"
              src={track?.album?.images[0]?.url}
              alt=""
            />
            <div>
              <h1
                className={`${
                  showAdditionalInfo && "!max-w-full "
                } max-w-[14ch] sm:max-w-[15ch] mdlg:max-w-[22ch] lg:max-w-[35ch] ${
                  !showAdditionalInfo && "truncate"
                } /truncate font-semibold `}
              >
                {track?.name}
              </h1>
              <h3 className={`text-sm  ${!showAdditionalInfo && "hidden"} `}>
                Artist: {track?.artists[0]?.name}
              </h3>
              <h3 className={`text-sm  ${!showAdditionalInfo && "hidden"} `}>
                Album: {track?.album?.name}
              </h3>
            </div>
            {playing ? (
              <PauseIcon
                className={`h-6 w-6 text-white/90 cursor-pointer    `}
                onClick={() => setPlaying(false)}
              />
            ) : (
              <PlayIcon
                className={`h-6 w-6 text-white/90 cursor-pointer   `}
                onClick={() => setPlaying(true)}
              />
            )}

            <div className={`${!playing && "hidden"}  mb-1.5`}>
              <AudioPlayAnimation
                height="20"
                width="30"
                radius="9"
                //color="#1DB954"
                color="white"
                ariaLabel="play-animation"
                wrapperStyle
              />
            </div>
          </div>

          <div className={`flex  items-center`}>
            {/* INFORMATION ICON */}
            <div
              aria-label="ignore-pause"
              onClick={() => setShowAdditionalInfo((prev) => !prev)}
              className="mr-2 flex items-center justify-center  italic -rotate-6 w-[18px] h-[18px]
              cursor-pointer rounded-full border border-gray-600 bg-white/90 text-sm text-black/80"
            >
              i
            </div>

            <CalendarDaysIcon className="h-5 w-5 text-gray-300 hidden md:inline mr-1.5" />
            <p className="text-sm font-light mr-3  hidden md:inline">
              {track?.album?.release_date.substring(0, 4)}
            </p>

            <ClockIcon className="h-5 w-5 mr-1.5 text-gray-300 hidden lg:inline" />
            <p className="font-light text-sm mr-3 lg:inline hidden">
              {convertMsToMinuteSecond(track?.duration_ms)}{" "}
            </p>

            <SparklesIcon className="h-5 w-5 text-gray-200 mr-1.5 hidden /xs:inline md:inline" />
            <p className="text-sm font-light hidden /xs:inline md:inline">
              {track?.popularity}%
            </p>

            {/* SPOTIFY ICON */}
            <div
              aria-label="ignore-pause"
              className=" ml-3 bg-spotifyBlack rounded-full z-50 xl:hidden"
            >
              <img
                aria-label="ignore-pause"
                onClick={() => window.open(track?.external_urls.spotify)}
                className="h-[21px] w-[21px] cursor-pointer z-50"
                src="../images/Spotify_Icon_CMYK_Green.png"
                alt="icon"
              />
            </div>

            {/* SPOTIFY LOGO (show on xl screens...) */}
            <img
              aria-label="ignore-pause"
              onClick={() => window.open(track?.external_urls.spotify)}
              className="h-[22px] cursor-pointer z-50 ml-3 xl:inline hidden"
              src="../images/Spotify_Logo_CMYK_Green.png"
              alt="logo"
            />

            <div
              aria-label="ignore-pause"
              onClick={handleLike}
              className={` ${liked() ? styles.heartRed : styles.heart}  ${
                !liked() && triggerLikeEffect && styles.animateUnlike
              }  ${liked() && triggerLikeEffect && styles.animate}  !-mr-4 `}
            />
          </div>
        </div>
        <hr className=" border-gray-600 w-full " />
      </>
    );
  } else {
    //return NORMAL Song design, (we don't recieve wideDesign in props)
    return (
      <div className="bg-cardBackground/40   rounded-xl border border-black/70 relative group ">
        <div
          aria-label="ignore-pause"
          onClick={() => setShowAdditionalInfo((prev) => !prev)}
          className="absolute top-2 left-2 flex items-center justify-center italic -rotate-6 w-[18px] h-[18px] cursor-pointer rounded-full border text-black/80 border-gray-600 bg-gray-300/90 text-sm"
        >
          i
        </div>

        <div
          aria-label="ignore-pause"
          onClick={handleLike}
          className={` absolute z-30 -top-2.5 -right-3.5  ${
            liked() ? styles.heartRed : styles.heart
          }  ${!liked() && triggerLikeEffect && styles.animateUnlike}  ${
            liked() && triggerLikeEffect && styles.animate
          }   `}
        />
        <div className=" relative// items-center// h-32// flex justify-center  mt-2   ">
          <Image
            className={` z-50  object-contain    `}
            src={track?.album?.images[0]?.url}
            alt="song-image"
            //layout="fill"
            height={128}
            width={128}
          />
        </div>

        <h1
          className={`text-smmd text-bold text-white mt-1.5 mb-0.5 mx-3      ${
            !showAdditionalInfo && "truncate"
          }  `}
        >
          {track?.name}
        </h1>

        <hr className={` my-1 border-gray-600  mx-3  `} />

        <h3
          className={`text-sm px-3 text-white  ${
            !showAdditionalInfo && "truncate"
          } `}
        >
          Artist: {track?.artists[0]?.name}
        </h3>
        <h3
          className={`text-sm mx-3 text-white  ${
            !showAdditionalInfo && "truncate"
          } `}
        >
          Album: {track?.album?.name}
        </h3>

        <h3
          className={`${
            !showAdditionalInfo && "hidden"
          } mx-3 text-sm mr-3 text-white  `}
        >
          Release year: {track?.album?.release_date.substring(0, 4)}
        </h3>

        <div className="flex justify-between items-center w-full my-2 ">
          <div className="ml-2 ">
            {playing ? (
              <div className="flex items-center">
                <PauseIcon
                  className={`h-6 w-6 text-white cursor-pointer    ${
                    noPlay && "hidden"
                  } `}
                  onClick={() => setPlaying(false)}
                />
                <div className="mb-1 ">
                  <AudioPlayAnimation
                    height="18"
                    width="18"
                    radius="9"
                    //color="#1DB954"
                    color="white"
                    ariaLabel="play-animation"
                    wrapperStyle
                  />
                </div>
              </div>
            ) : (
              <PlayIcon
                className={`h-6 w-6 text-white cursor-pointer       ${
                  noPlay && "hidden"
                } `}
                onClick={() => setPlaying(true)}
              />
            )}
          </div>
          <img
            onClick={() => window.open(track?.external_urls.spotify)}
            className="h-[22px] mr-3 cursor-pointer"
            src="../images/Spotify_Logo_CMYK_Green.png"
            alt="spotify logo/icon"
          />
        </div>
      </div>
    );
  }
}

export default SongExtended;
