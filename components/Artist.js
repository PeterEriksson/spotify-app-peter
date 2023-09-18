import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Artist({ artist, discoverPage, artistsSelected, setArtistsSelected }) {
  const router = useRouter();
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const isArtistSelected = () => {
    return artistsSelected?.some((id) => id == artist.id);
  };

  const handleClick = (e) => {
    //if we click information or spotify icon we let the onclick of those respective elements go ahead and perform their actions.
    if (e.target.getAttribute("aria-label") === "ignore-pause") return;

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
      //user is not in discover page. Redirect to artist page.
      router.push("/artists/" + artist?.id);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`bg-cardBackground/40 rounded-xl border group cursor-pointer relative overflow-hidden text-white   ${
        isArtistSelected() ? "border-spotifyGreen " : "border-black/70"
      } ${discoverPage && "flex-shrink-0 pt-6 pb-2 px-2.5 "}  `}
    >
      {/* INFORMATION ICON */}
      <div
        aria-label="ignore-pause"
        onClick={() => setShowAdditionalInfo((prev) => !prev)}
        //onClick={() => console.log(artist)}
        className="absolute top-1.5 left-2 flex items-center justify-center italic -rotate-6 w-[17px] h-[17px] cursor-pointer rounded-full border text-black/80 border-gray-600 bg-gray-300/90 text-sm"
      >
        i
      </div>
      {/* SPOTIFY ICON */}
      <div className=" bg-spotifyBlack rounded-full        absolute z-40 top-1.5 right-1.5 h-[21px] w-[21px] cursor-pointer ">
        <img
          aria-label="ignore-pause"
          onClick={() => window.open(artist?.external_urls.spotify)}
          className={` `}
          src="../images/Spotify_Icon_CMYK_Green.png"
          alt="icon"
        />
      </div>
      <div className=" relative// items-center// h-32// flex justify-center mt-2   ">
        <Image
          className={` z-50  object-contain cursor-pointer    `}
          src={artist?.images[0]?.url}
          alt="artist-image"
          //layout="fill"
          height={128}
          width={128}
        />
      </div>

      <h1
        className={` cursor-pointer py-1  w-fit mx-auto ${
          !discoverPage && "group-hover:underline"
        } ${discoverPage && !showAdditionalInfo && "max-w-[12ch] truncate"}  `}
      >
        {artist?.name}
      </h1>
      {showAdditionalInfo && (
        <>
          <hr className=" border-gray-600   mb-2" />
          <h3 className="">Popularity: {artist.popularity}</h3>
          <h3 className="flex flex-col  ">
            Genres:
            {artist.genres.map((genre, i) => (
              <p key={i} className="italic ">
                &nbsp;{genre}
                {artist.genres.length !== i + 1 && ","}
              </p>
            ))}
          </h3>
        </>
      )}
    </div>
  );
}

export default Artist;
