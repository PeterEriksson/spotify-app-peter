import {
  PauseIcon,
  PlayIcon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";

function Song({ track }) {
  const [audio] = useState(new Audio(track.preview_url));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  const starRef = useRef(null);
  /* when interacting with sidebar, song keeps on playing...solution ->  */
  const handleStopPlay = (e) => {
    //user has clicked StarIcon -> song should keep playing. although if we click another song starIcon it stops..
    if (starRef.current && starRef.current.contains(e.target)) return;
    //else stop
    setPlaying(false);
  };
  useEffect(() => {
    document.addEventListener("click", handleStopPlay, true);
    return () => {
      document.removeEventListener("click", handleStopPlay, true);
    };
  }, []);

  return (
    <div className="bg-gray-700 rounded-xl border border-black/70 relative group  ">
      <img
        className={`h-40 w-full object-cover rounded-t-xl group-hover:opacity-40 transition duration-300 ease-in-out ${
          playing && "opacity-40"
        } `}
        src={track.album.images[0]?.url}
        alt=""
      />
      <h2 className="text-bold text-white p-4">{track.name}</h2>
      <StarIcon
        ref={starRef}
        //onClick={(e) => console.log(e.target.tagName.toLowerCase())}
        className="h-7 w-7 cursor-pointer absolute  top-1 left-1 text-white //text-spotifyGreen"
      />
      {playing ? (
        <PauseIcon
          className="h-14 w-14 text-white cursor-pointer    absolute top-0 right-0 left-0 bottom-24 md:bottom-28 m-auto"
          onClick={() => setPlaying(false)}
        />
      ) : (
        <PlayIcon
          className="h-14 w-14 text-white cursor-pointer //bg-red-400    absolute top-0 right-0 left-0 bottom-16 md:bottom-20 m-auto      group-hover:-translate-y-4 group-hover:opacity-100   opacity-0  transition !duration-500 transform ease-in-out "
          onClick={() => setPlaying(true)}
        />
      )}
    </div>
  );
}

export default Song;
