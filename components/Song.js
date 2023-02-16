import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

function Song({ track }) {
  const [audio] = useState(new Audio(track.preview_url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying((prev) => !prev);

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
    <div className="flex items-center space-x-3">
      <img
        className="h-14 w-14 "
        src={track.album.images[0]?.url}
        alt="previously played img"
      />
      <h3 className="text-lg font-base text-gray-300">{track?.name}</h3>
      {playing ? (
        <PauseIcon
          className="h-7 w-7 text-white cursor-pointer"
          onClick={toggle}
        />
      ) : (
        <PlayIcon
          className="h-7 w-7 text-white cursor-pointer"
          onClick={toggle}
        />
      )}
    </div>
  );
}

export default Song;
