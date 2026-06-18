import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import spotifyApi from "../lib/spotify";

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) return;

    if (session.error === "RefreshTokenExpired") {
      signOut({ redirect: false }).then(() => {
        signIn("spotify");
      });
      return;
    }

    spotifyApi.setAccessToken(session.user.accessToken);
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
