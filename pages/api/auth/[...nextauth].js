//Check https://authjs.dev/guides/basics/refresh-token-rotation
//18/6-26: new token rules.
//https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration

import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    // console.log("REFRESHED TOKEN IS", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, //1 hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      //Replace if new one came back else fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    //new
    const spotifyError = error?.body?.error;

    return {
      ...token,
      //error: "RefreshAccessTokenError",
      error:
        spotifyError === "invalid_grant"
          ? "RefreshTokenExpired"
          : "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      //return previous token if access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        // console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }
      //Access token has expired, so we need to refresh it
      // console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      //(new) expose error to client
      session.error = token.error;

      return session;
    },
  },
});
