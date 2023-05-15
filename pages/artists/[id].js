import React, { useEffect, useState } from "react";
import useSpotify from "../../hooks/useSpotify";

export default function artistDetails({ id }) {
  const [artist, setArtist] = useState({});
  const [loading, setLoading] = useState(false);
  const [artistTopSongs, setArtistTopSongs] = useState([]);

  const spotifyApi = useSpotify();
  const getArtistInfo = () => {
    spotifyApi
      .getArtist(id)
      .then((data) => setArtist(data.body))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };

  /* Keep artist top songs?? */
  useEffect(() => {
    setLoading(true);
    //ux friendly - display loading indicator a bit longer
    setTimeout(() => {
      getArtistInfo();
    }, 1200);
  }, []);

  const getArtistTracks = () => {
    spotifyApi
      .getArtistTopTracks(id, "GB")
      .then((data) => setArtistTopSongs(data.body))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getArtistTracks();
  }, []);

  return (
    <div onClick={() => console.log(artist)}>
      <h1>{artist?.name}</h1>
      <h2>{artist?.popularity}</h2>

      <h3>{loading && "LOADING"}</h3>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  return {
    props: {
      id,
    },
  };
}
