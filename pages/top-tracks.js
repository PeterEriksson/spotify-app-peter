import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";
import { Waveform } from "@uiball/loaders";
import Song from "../components/Song";
import Head from "next/head";
import Header from "../components/Header";

export default function tracks() {
  const spotifyApi = useSpotify();
  const [topTracks, setTopTracks] = useState([]);
  const [timePeriod, setTimePeriod] = useState("short_term");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  //sliding tabs
  //guide: https://www.seancdavis.com/posts/animated-sliding-tabs-with-react-and-tailwind/
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);
  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      //console.log(currentTab?.offsetLeft, currentTab?.clientWidth);
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    }
    setTabPosition();
    window.addEventListener("resize", setTabPosition);
    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);

  //https://github.com/thelinmichael/spotify-web-api-node/issues/440
  //getMyTopTracks({time_range: "short_term"}) - There are 3 time range options: short_term, long_term and medium_term.
  //implement function for choosing short,medium or long_term

  const getTracks = () => {
    spotifyApi
      .getMyTopTracks({ limit: 10, time_range: timePeriod })
      .then((data) => setTopTracks(data.body.items))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setLoading(true);
      //increase loading-spinner time -> more ux friendly
      setTimeout(() => {
        getTracks();
      }, 500);
    }
  }, [activeTabIndex]); //trigger when user changes timePeriod/tabIndex

  const tabsData = [
    {
      text: "Short term",
      label: "short_term",
    },
    {
      text: "Medium term",
      label: "medium_term",
    },
    {
      text: "Long term",
      label: "long_term",
    },
  ];

  const handleTimePeriodClick = (idx, tab) => {
    if (loading) return;
    setActiveTabIndex(idx);
    setTimePeriod(tab.label);
  };

  return (
    <div className="flex h-screen  ">
      <Head>
        <title>Top Tracks</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className=" w-screen bg-bodyBackground  overflow-y-scroll">
        <Header />

        <h1 className="text-3xl text-white text-center uppercase tracking-wide">
          most played songs
        </h1>

        <div className="relative max-w-fit mx-auto">
          <div className="flex text-white uppercase tracking-wide justify-center space-x-4 mt-2.5 ">
            {tabsData.map((tab, idx) => (
              <button
                key={idx}
                ref={(el) => (tabsRef.current[idx] = el)}
                className="pt-2 pb-3"
                onClick={() => handleTimePeriodClick(idx, tab)}
              >
                {tab.text}
              </button>
            ))}
          </div>
          <span
            className="absolute bottom-0 block h-1  bg-spotifyGreen/// bg-white/80 transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          />
        </div>

        {/* TOP TRACKS */}
        {loading ? (
          <div className="flex justify-center mt-4">
            <Waveform color="white" speed={0.8} />
          </div>
        ) : (
          <div className="!mx-4 gap-3 my-3 grid grid-cols-1 xs:grid-cols-2  md:grid-cols-3 mdlg:grid-cols-4 lg:grid-cols-5 lg:mx-auto lg:px-2 max-w-4xl ">
            {topTracks
              ?.filter((track) => track.preview_url !== null)
              .map((track, i) => (
                <Song key={i} track={track} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

//(when refreshing the page -> data is not shown. solution) ->
//onload issue -> pre-fetch the session / pre render the user -> data is shown.
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
