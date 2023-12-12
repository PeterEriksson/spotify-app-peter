import { RaceBy } from "@uiball/loaders";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Artist from "../../components/Artist";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import useSpotify from "../../hooks/useSpotify";
import generalData from "../../data.json";

export default function Home() {
  const spotifyApi = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
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

  const getArtists = () => {
    spotifyApi
      .getMyTopArtists({ limit: 10, time_range: timePeriod })
      .then((data) => setTopArtists(data.body.items))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setLoading(true);
      //increase loading-spinner time -> more ux friendly
      setTimeout(() => {
        getArtists();
      }, 500);
    }
  }, [activeTabIndex]); //trigger when user changes timePeriod/tabIndex

  const handleTimePeriodClick = (idx, tab) => {
    if (loading) return;
    setActiveTabIndex(idx);
    setTimePeriod(tab.label);
  };

  return (
    <div className={`  ${loading && "h-screen"}   pageMobileHeaderTempSol `}>
      {/* <Sidebar /> */}
      {/*  <div className=" w-screen bg-bodyBackground overflow-y-scroll   "> */}
      {/* <Header /> */}

      <h1 className="text-xl xxs:text-2xl text-white/50 text-center uppercase tracking-tight    -mb-3 xxs:-mb0">
        most played artists
      </h1>

      <div className="relative max-w-fit mx-auto     xxs:sticky xxs:z-[36] xxs:top-2">
        <div className="flex text-white uppercase tracking-wide justify-center space-x-4 mt-2.5 ">
          {generalData.tabsData.map((tab, idx) => (
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

      {loading ? (
        <div className="flex justify-center   mt-24">
          <RaceBy color="white" speed={1.2} size={150} lineWeight={4} />
        </div>
      ) : (
        <div className="!mx-4 gap-3 my-3 grid grid-cols-1 xs:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 lg:!mx-auto lg:px-2 max-w-6xl  ">
          {topArtists?.map((_artist, i) => (
            //<Artist key={i} artist={_artist} />
            <Artist key={i} artist={_artist} />
          ))}
        </div>
      )}
      {/* </div> */}
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
