import {
  PauseIcon,
  PlayIcon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

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

  return (
    <div className="bg-gray-700 rounded-xl border border-black/70 relative group  ">
      <img
        className={`h-40 w-full object-cover rounded-t-xl group-hover:opacity-50 transition duration-500 ease-in-out ${
          playing && "opacity-50"
        } `}
        src={track.album.images[0]?.url}
        alt=""
      />
      <h2 className="text-bold text-white p-4">{track.name}</h2>
      <StarIcon className="h-7 w-7 cursor-pointer absolute  top-1 left-1 text-white //text-spotifyGreen" />
      {playing ? (
        <PauseIcon
          className="h-14 w-14 text-white cursor-pointer    absolute top-0 right-0 left-0 bottom-28 m-auto"
          onClick={() => setPlaying(false)}
        />
      ) : (
        <PlayIcon
          className="h-14 w-14 text-white cursor-pointer //bg-red-400    absolute top-0 right-0 left-0 bottom-20 m-auto      group-hover:-translate-y-4 group-hover:opacity-100   opacity-0  transition !duration-500 transform ease-in-out "
          onClick={() => setPlaying(true)}
        />
      )}
    </div>
  );
}

export default Song;
