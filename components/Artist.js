import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function Artist({ artist }) {
  const router = useRouter();

  return (
    <div
      className="bg-gray-700 rounded-xl border border-black/70  group cursor-pointer      overflow-hidden "
      onClick={() => router.push("/artists/" + artist?.id)}
    >
      <div className="relative flex items-center justify-center  h-40 w-full       ">
        <Image
          className={`object-cover rounded-t-xl  
           group-hover:opacity-90
           transition duration-[400ms] ease-in-out  group-hover:scale-110   `}
          src={artist?.images[0]?.url}
          alt="song-image"
          layout="fill"
        />
      </div>

      <h3 className={`py-4 text-center text-white  `}>{artist?.name}</h3>
    </div>
  );
}

export default Artist;
