import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../store";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isArtistPage = router.route === "/artists/[artistId]";

  //(TEMP solution (see [artistId].js ) -> special render including Sidebar and Header)
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {session ? (
          <div className="flex     h-screen overflow-y-auto//      flex-col-reverse xxs:flex-row  ">
            <Sidebar />
            <div className=" w-screen  overflow-y-auto  !bg-bodyBackground   ">
              <Header backArrow={isArtistPage} />
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
