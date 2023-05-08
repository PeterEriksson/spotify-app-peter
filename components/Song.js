import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/effects.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  selectItems as selectFavoritedItmes,
} from "../slices/favoritesSlice";

function Song({ track }) {
  const [audio] = useState(new Audio(track.preview_url));
  const [playing, setPlaying] = useState(false);
  //console.log(track);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  const heartRef = useRef(null);
  /* when interacting with sidebar, song keeps on playing...solution ->  */
  const handleStopPlay = (e) => {
    //user has clicked StarIcon -> song should keep playing. although if we click another song starIcon it stops..
    //if (heartRef.current && heartRef.current.contains(e.target)) return;
    //user has clicked a star of another song -> keep on playing (right now we only use aria-label on this component...)

    /* ....enough with following line of code. Don't need to use ref to get the result we want. */
    if (e.target.getAttribute("aria-label") === "heart-icon-track") return;
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
  /* TEST TEMP */
  const [triggerLikeEffect, setTriggerLikeEffect] = useState(false);
  /* ---- */

  const handleLike = () => {
    setTriggerLikeEffect(true);
    favoritedItems.every((item) => item.id !== track.id)
      ? dispatch(addToFavorites(track))
      : dispatch(removeFromFavorites(track.id));

    console.log(favoritedItems);
  };

  const liked = () => {
    return favoritedItems.some((item) => item.id === track.id);
  };

  return (
    <div className="bg-gray-700 rounded-xl border border-black/70 relative group  ">
      {/* DIV for centering play/pause */}
      <div className="relative flex items-center justify-center  ">
        <img
          className={`h-40 w-full object-cover rounded-t-xl group-hover:opacity-40 transition duration-300 ease-in-out ${
            playing && "opacity-40"
          } `}
          src={track.album.images[0]?.url}
          alt=""
        />
        {playing ? (
          <PauseIcon
            className="h-14 w-14 text-white cursor-pointer   absolute "
            onClick={() => setPlaying(false)}
          />
        ) : (
          <PlayIcon
            className="h-14 w-14 text-white cursor-pointer  absolute  mt-6   group-hover:-translate-y-4 group-hover:opacity-100   opacity-0  transition !duration-500 transform ease-in-out "
            onClick={() => setPlaying(true)}
          />
        )}
      </div>
      <h2 className="text-bold text-white p-4">{track.name}</h2>
      {/* HEART ICON DIV */}
      <div
        aria-label="heart-icon-track"
        onClick={() => handleLike()}
        ref={heartRef}
        className={` absolute -top-1.5 -left-1.5  ${
          liked() ? styles.heartRed : styles.heart
        }  ${!liked() && triggerLikeEffect && styles.animateUnlike}  ${
          liked() && triggerLikeEffect && styles.animate
        }   `}
      />
    </div>
  );
}

export default Song;
