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
      if (isArtistSelected()) {
        setArtistsSelected((prevArtists) =>
          prevArtists.filter((id) => id !== artist.id)
        );
      } else {
        //only let the user select max 3 artists
        if (artistsSelected.length >= 3) return;
        //add artist to selected
        setArtistsSelected((prev) => [...prev, artist.id]);
      }
    } else {
      //user is not in discover page
      router.push("/artists/" + artist?.id);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl border group cursor-pointer overflow-hidden ${
        discoverPage &&
        "w-28  flex-shrink-0 mdlg:w-full    transition duration-[250ms] ease-in-out  "
      }   ${isArtistSelected() ? "border-spotifyGreen " : "border-black/70"}  `}
      onClick={handleClick}
    >
      <div
        className={`relative flex items-center justify-center w-full       ${
          discoverPage ? "h-[88px]" : "h-40"
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
