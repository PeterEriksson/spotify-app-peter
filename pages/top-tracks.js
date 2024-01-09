import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";
import { Waveform } from "@uiball/loaders";
import Head from "next/head";
import Header from "../components/Header";
import Song from "../components/Song";
import {
  selectItems as selectSongsShortTerm,
  setSongsShortTerm,
} from "../slices/songsShortTermSlice";
import {
  selectItems as selectSongsMediumTerm,
  setSongsMediumTerm,
} from "../slices/songsMediumTermSlice";
import {
  selectItems as selectSongsLongTerm,
  setSongsLongTerm,
} from "../slices/songsLongTermSlice";
import { useSelector, useDispatch } from "react-redux";
import generalData from "../data.json";

export default function tracks() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const songsShortTerm = useSelector(selectSongsShortTerm);
  const songsMediumTerm = useSelector(selectSongsMediumTerm);
  const songsLongTerm = useSelector(selectSongsLongTerm);
  const dispatch = useDispatch();

  //sliding tabs. guide: https://www.seancdavis.com/posts/animated-sliding-tabs-with-react-and-tailwind/
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

  const getTracks = () => {
    if (activeTabIndex == 0 && songsShortTerm.length == 0) {
      //short term songs aren't stored in global state -> make api call  ->
      spotifyApi
        .getMyTopTracks({ limit: 10, time_range: "short_term" })
        .then((data) => {
          dispatch(setSongsShortTerm(data.body.items));
          setTopTracks(data.body.items);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          //console.log("songs api call test");
          setLoading(false);
        });
    }
    //we already have these songs stored in global state ->
    else if (activeTabIndex == 0) {
      setTopTracks(songsShortTerm);
      setLoading(false);
    }

    if (activeTabIndex == 1 && songsMediumTerm.length == 0) {
      //medium term songs aren't stored in global state -> make api call  ->
      spotifyApi
        .getMyTopTracks({ limit: 10, time_range: "medium_term" })
        .then((data) => {
          dispatch(setSongsMediumTerm(data.body.items));
          setTopTracks(data.body.items);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          //console.log("songs api call test");
          setLoading(false);
        });
    }
    //we already have these songs stored in global state ->
    else if (activeTabIndex == 1) {
      setTopTracks(songsMediumTerm);
      setLoading(false);
    }

    if (activeTabIndex == 2 && songsLongTerm.length == 0) {
      //long term songs aren't stored in global state -> make api call  ->
      spotifyApi
        .getMyTopTracks({ limit: 10, time_range: "long_term" })
        .then((data) => {
          dispatch(setSongsLongTerm(data.body.items));
          setTopTracks(data.body.items);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          //console.log("songs api call test");
          setLoading(false);
        });
    }
    //we already have these songs stored in global state ->
    else if (activeTabIndex == 2) {
      setTopTracks(songsLongTerm);
      setLoading(false);
    }
  };

  //trigger getTracks when period is changed
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setLoading(true);
      //increase loading-spinner time -> more ux friendly
      setTimeout(() => {
        getTracks();
      }, 500);
    }
  }, [activeTabIndex]);

  const handleTimePeriodClick = (idx) => {
    if (loading) return;
    setActiveTabIndex(idx);
  };

  return (
    <div
      className={` pageMobileHeaderTempSol     ${
        songsShortTerm.length == 0 && "h-screen"
      }  `}
    >
      <Head>
        <title>TrackTrends | Top Tracks</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-xl xxs:text-2xl text-white/50 text-center uppercase tracking-tight   -mb-3 xxs:-mb0">
        most played songs
      </h1>

      {/* TIME PERIOD TABS */}
      <div className="relative max-w-fit mx-auto xxs:sticky xxs:z-[36] xxs:top-2  ">
        <div className="flex text-white uppercase tracking-wide justify-center space-x-4 mt-2.5 ">
          {generalData.tabsData.map((tab, idx) => (
            <button
              key={idx}
              ref={(el) => (tabsRef.current[idx] = el)}
              className={`pt-2 pb-3     ${
                activeTabIndex !== idx && "xxs:hover:border-white/20"
              }  border-b-4 border-transparent  transition-all duration-200 ease-in`}
              onClick={() => handleTimePeriodClick(idx)}
            >
              {tab.text}
            </button>
          ))}
        </div>
        <span
          className="absolute bottom-0 block h-1 bg-white/80 transition-all duration-300 "
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </div>

      {/* TOP TRACKS */}
      {loading ? (
        <div className="flex justify-center mt-4  h-screen">
          <Waveform color="white" speed={0.8} />
        </div>
      ) : (
        <div className="  !mx-4 my-3 gap-3 grid grid-cols-1  xs:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 lg:!mx-auto lg:px-2 max-w-6xl  ">
          {topTracks
            ?.filter((track) => track.preview_url !== null)
            .map((_track, i) => (
              <Song key={i} track={_track} />
            ))}
        </div>
      )}
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
