/* helps us interact with the spotify api */
/* https://github.com/thelinmichael/spotify-web-api-node */
import SpotifyWebApi from "spotify-web-api-node";

/* permissions... */
const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-email",
  /* "streaming", */
  "user-read-private",
  "user-library-read",
  /* ...not recommended.../S(58:20) */
  //"user-library-modify",
  "user-top-read",
  /* "user-read-playback-state", */
  /* "user-modify-playback-state", */
  /* "user-read-currently-playing", */
  "user-read-recently-played",
  "user-follow-read",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params).toString();

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };
