import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";

export default function tracks() {
  const spotifyApi = useSpotify();
  const [topTracks, setTopTracks] = useState([]);
  const [timePeriod, setTimePeriod] = useState("short_term");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);
  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      console.log(currentTab?.offsetLeft, currentTab?.clientWidth);
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
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      setLoading(true);
      spotifyApi
        .getMyTopTracks({ time_range: timePeriod })
        .then((data) => setTopTracks(data.body.items))
        .then(() => setLoading(false))
        .catch((err) => console.log(err));
    }
    //console.log("time changed"); ok
  }, [activeTabIndex]); //trigger when user changes timePeriod/tabIndex

  //test ok..
  /* useEffect(() => {
    console.log(topTracks);
  }, [topTracks]); */

  const tabsData = [
    {
      text: "Short Term",
      label: "short_term",
    },
    {
      text: "Medium Term",
      label: "medium_term",
    },
    {
      text: "Long Term",
      label: "long_term",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-800 ">
      <Sidebar />

      <div className=" w-screen bg-gray-800  overflow-y-scroll">
        {/* GITHUB + LOGOUT */}
        <div className="flex justify-end  text-white space-x-3 py-2 mr-5">
          <SocialIcon
            target="_blank"
            url="https://github.com/PeterEriksson/spotify-app-peter"
            bgColor="transparent"
            fgColor="#ffffff"
            className="!h-10 !w-10 transition duration-150 ease-in hover:opacity-50 hover:cursor-pointer"
          />
          <button
            onClick={() => signOut()}
            className="space-x-1  transition duration-150 ease-in hover:opacity-50 flex items-center hover:cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className=" !h-7 !w-7" />
            <p className="text-sm">Logout</p>
          </button>
        </div>

        <h3 className="text-3xl text-white text-center uppercase tracking-wide">
          most played songs
        </h3>

        <div>
          <div className="relative">
            <div className=" flex text-white uppercase tracking-wide justify-center space-x-4 mt-2.5 ">
              {tabsData.map((tab, idx) => (
                <button
                  key={idx}
                  ref={(el) => (tabsRef.current[idx] = el)}
                  className="pt-2 pb-3"
                  onClick={() => setActiveTabIndex(idx)}
                >
                  {tab.text}
                </button>
              ))}
            </div>
            <span
              className="absolute bottom-0 block h-1 bg-teal-500 transition-all duration-300"
              style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
            />
          </div>
        </div>
        {/* TOP TRACKS */}
        {loading ? (
          /* Try using react loading library. Maybe use timeout to increase loading time */
          <h2>LOADING</h2>
        ) : (
          <div className="gap-3 my-3   grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 lg:mx-auto lg:px-2 max-w-4xl mx-3 ">
            {topTracks?.slice(0, 10).map((topTrack, i) => (
              <div
                className="bg-gray-700 rounded-xl border border-black/70"
                key={i}
              >
                <img
                  className="h-40 w-full object-cover rounded-t-xl"
                  src={topTrack.album.images[0]?.url}
                  alt=""
                />
                <h2 className="text-bold text-white p-4">{topTrack.name}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
//onload issue -> pre-fetch the session / pre render the user -> data is shown.
///when refreshing the page -> data is not shown. solution) ->
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
