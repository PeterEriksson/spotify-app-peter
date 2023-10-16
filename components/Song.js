import {
  CalendarDaysIcon,
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
import { convertMsToMinuteSecond } from "../lib/timeUtils.js";
import { useRouter } from "next/router";

function Song({ track, noPlay, wideDesign, nr }) {
  const router = useRouter();

  const [audio, setAudio] = useState(new Audio(track?.preview_url));
  const [playing, setPlaying] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const [triggerLikeEffect, setTriggerLikeEffect] = useState(false);
  const [pauseTriggerEffect, setPauseTriggerEffect] = useState(false);

  const dispatch = useDispatch();
  const favoritedItems = useSelector(selectFavoritedItmes);

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

  //be able to easily/instantly pause a song. Listen to click
  useEffect(() => {
    document.addEventListener("click", handleStopPlay, true);
    return () => {
      document.removeEventListener("click", handleStopPlay, true);
    };
  }, []);

  const handleLike = () => {
    setTriggerLikeEffect(true);
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
          <div className="flex items-center space-x-1.5 sm:space-x-3 mdlg:space-x-4 lg:space-x-5">
            {playing ? (
              <div className={`mr-1 xxs:-mr-1.5    w-2.5`}>
                <AudioPlayAnimation
                  height="28"
                  width="10"
                  radius="9"
                  color="#1DB954"
                  //color="white"
                  ariaLabel="play-animation"
                  wrapperStyle
                />
              </div>
            ) : (
              <p className="mr-1 xxs:-mr-1.5   w-2.5">{nr}</p>
            )}

            <img
              className="      h-8 w-8 xxs:h-9 xxs:w-9 object-contain"
              src={track?.album?.images[0]?.url}
              alt=""
            />

            <div>
              <h1
                className={`${
                  showAdditionalInfo && "!max-w-full "
                } max-w-[13ch] sm:max-w-[15ch] mdlg:max-w-[22ch] lg:max-w-[35ch] ${
                  !showAdditionalInfo && "truncate"
                } /truncate font-semibold ${playing && "text-spotifyGreen"} `}
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
              <button
                onClick={() => setPlaying(false)}
                className={`rounded-full bg-spotifyGreen cursor-pointer p-[6px] ${
                  pauseTriggerEffect && styles.playAnimate
                }    ${styles.noHighLight} `}
              >
                <PauseIcon className={`h-4 w-4 text-white/90     `} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setPlaying(true);
                  setPauseTriggerEffect(true);
                }}
                className={`rounded-full bg-spotifyGreen p-[6px] cursor-pointer ${
                  pauseTriggerEffect && styles.pauseAnimate
                }   ${styles.noHighLight}`}
              >
                <PlayIcon className={`h-4 w-4 text-white/90    `} />
              </button>
            )}
          </div>

          <div className={`flex  items-center`}>
            {/* INFORMATION ICON */}
            <div
              aria-label="ignore-pause"
              onClick={() => setShowAdditionalInfo((prev) => !prev)}
              className="xxs:mr-2 flex items-center justify-center  italic -rotate-6 w-[18px] h-[18px]
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
              className=" ml-3 xxs:-mr-0 -mr-1  bg-spotifyBlack rounded-full z-[34] xl:hidden"
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

            {/* HEART ICON (wide) */}
            <div
              aria-label="ignore-pause"
              onClick={handleLike}
              className={` ${liked() ? styles.heartRed : styles.heart}  ${
                !liked() && triggerLikeEffect && styles.animateUnlike
              }  ${liked() && triggerLikeEffect && styles.animate}  !-mr-4  ${
                styles.noHighLight
              } `}
            />
          </div>
        </div>
        <hr className=" border-gray-600 w-full " />
      </>
    );
  } else {
    //return NORMAL Song design, (we don't recieve wideDesign in props)
    return (
      <div
        className={`bg-cardBackground/40   rounded-xl border border-black/70 relative group  `}
      >
        {/* INFORMATION ICON */}
        <div
          aria-label="ignore-pause"
          onClick={() => setShowAdditionalInfo((prev) => !prev)}
          className="absolute top-2 left-2.5 flex items-center justify-center italic -rotate-6 w-[18px] h-[18px] cursor-pointer rounded-full border text-black/80 border-gray-600 bg-gray-300/90 text-sm"
        >
          i
        </div>

        {/* HEART ICON */}
        <div
          aria-label="ignore-pause"
          onClick={handleLike}
          className={` absolute z-30 -top-2.5 -right-2  ${
            liked() ? styles.heartRed : styles.heart
          }  ${!liked() && triggerLikeEffect && styles.animateUnlike}  ${
            liked() && triggerLikeEffect && !noPlay && styles.animate
          } ${styles.noHighLight}   `}
        />
        <div
          /* onClick={() => {
            //console.log(track)
            router.push("/artists/" + track.artists[0].id);
          }} */
          className="/cursor-pointer relative// items-center// h-32// flex justify-center  mt-2   "
        >
          <Image
            className={` z-[35]  object-contain    `}
            src={track?.album?.images[0]?.url}
            alt="song-image"
            //layout="fill"
            // height={128}
            // width={128}
            height={140}
            width={140}
          />
        </div>

        <div className="flex items-center   mx-3 space-x-1.5">
          <h1
            className={`text-smmd text-bold ${
              playing ? "text-spotifyGreen" : "text-white"
            }  mt-1.5 mb-0.5 //mx-3      ${
              !showAdditionalInfo && "truncate"
            }  `}
          >
            {track?.name}
          </h1>
          {playing && (
            <div className="ml-1/ overflow-hidden">
              <AudioPlayAnimation
                height="18"
                width="18"
                radius="9"
                color="#1DB954"
                //color="white"
                ariaLabel="play-animation"
                wrapperStyle
              />
            </div>
          )}
        </div>

        <hr className={` my-1 border-gray-600  mx-3  `} />

        <h3
          onClick={() => {
            //console.log(track)
            router.push("/artists/" + track.artists[0].id);
          }}
          className={`w-fit cursor-pointer hover:underline  text-sm px-3  text-white ${
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
          } mx-3 text-sm mr-3  text-white   `}
        >
          Release year: {track?.album?.release_date.substring(0, 4)}
        </h3>

        <img
          onClick={() => window.open(track?.external_urls.spotify)}
          className=" h-[22px] ml-2.5 mt-1 mb-2.5 cursor-pointer"
          src="../images/Spotify_Logo_CMYK_Green.png"
          alt="spotify logo/icon"
        />

        {!noPlay && (
          <button
            onClick={() => {
              //setPlaying(true);
              setPlaying((prev) => !prev);
              setPauseTriggerEffect(true);
            }}
            className={`
            bg-spotifyGreen p-2.5 rounded-full  absolute bottom-2 right-2        transform transition duration-500 ease-in hover:scale-110 xxs:hover:scale-100    ${
              styles.noHighLight
            }  ${playing && styles.playAnimate} 
            ${!playing && pauseTriggerEffect && styles.pauseAnimate}
            `}
          >
            {playing ? (
              <PauseIcon className={`h-5 w-5 text-white cursor-pointer    `} />
            ) : (
              <PlayIcon className={`h-5 w-5 text-white cursor-pointer   `} />
            )}
          </button>
        )}
      </div>
    );
  }
}

export default Song;
