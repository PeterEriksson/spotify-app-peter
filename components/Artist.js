import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function Artist({ artist, discoverPage, artistsSelected, setArtistsSelected }) {
  const router = useRouter();

  const isArtistSelected = () => {
    return artistsSelected?.some((id) => id == artist.id);
  };

  const handleClick = () => {
    if (discoverPage) {
      const newArr = artistsSelected.filter((id) => id !== artist.id);
      //if artist is already selected we remove it from the arr, else we add.
      isArtistSelected()
        ? setArtistsSelected(newArr)
        : setArtistsSelected((prev) => [...prev, artist.id]);
    } else {
      router.push("/artists/" + artist?.id);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl border border-black/70  group cursor-pointer      overflow-hidden    ${
        discoverPage &&
        "w-28  flex-shrink-0 mdlg:w-full    transition duration-[250ms] ease-in-out  "
      }   ${isArtistSelected() && "border-spotifyGreen "}  `}
      //onClick={() => router.push("/artists/" + artist?.id)}
      onClick={handleClick}
    >
      <div
        className={`relative flex items-center justify-center w-full       ${
          discoverPage ? "h-28" : "h-40"
        }  `}
      >
        <Image
          className={`object-cover rounded-t-xl  
            
           transition duration-[400ms] ease-in-out  /group-hover:scale-110 ${
             discoverPage ? "" : "group-hover:scale-110"
           }  `}
          src={artist?.images[0]?.url}
          alt="song-image"
          layout="fill"
        />
      </div>
      <h3
        className={`${
          discoverPage ? "py-1.5 px-2 text-sm truncate" : "py-3"
        }   text-center text-white  `}
      >
        {artist?.name}
      </h3>
    </div>
  );
}

export default Artist;
