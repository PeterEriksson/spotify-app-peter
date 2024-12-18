import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../store";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isArtistPage = router.route === "/artists/[artistId]";

  //(fix bug in [artistId].js ) -> have to there inclucde Sidebar and Header )
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {session ? (
          <div className={`flex xxs:h-screen flex-col-reverse xxs:flex-row  `}>
            <Sidebar />
            <div
              className={`w-screen overflow-scroll bg-gradient-to-tr from-[#333333] to-[#000000] `}
            >
              <Header backArrow={isArtistPage} />
              <NextNProgress options={{ showSpinner: false }} color="#ffffff" />

              <Toaster position="top-center" />

              <Component {...pageProps} />
            </div>
          </div>
        ) : (
          //redirects to login page (_middleware)
          <Component {...pageProps} />
        )}
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
