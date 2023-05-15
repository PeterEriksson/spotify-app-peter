import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function Artist({ artist }) {
  const { asPath } = useRouter();
  const router = useRouter();

  return (
    <div
      className="bg-gray-700 rounded-xl border border-black/70  group cursor-pointer"
      onClick={() => router.push("/artists/" + artist?.id)}
      /* onClick={() => console.log(asPath)} */
    >
      <div className="relative flex items-center justify-center    h-40 w-full ">
        <Image
          className={`object-cover rounded-t-xl  
           group-hover:opacity-60
           transition duration-300 ease-in-out    `}
          src={artist?.images[0]?.url}
          alt="song-image"
          layout="fill"
        />
      </div>

      <h3 className={`py-4 text-center text-white align-text-bottom `}>
        {artist?.name}
      </h3>
    </div>
  );
}

export default Artist;
