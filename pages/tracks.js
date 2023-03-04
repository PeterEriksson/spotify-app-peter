import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";

export default function tracks() {
  const spotifyApi = useSpotify();
  const [topTracks, setTopTracks] = useState([]);
  const [timePeriod, setTimePeriod] = useState("short_term");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

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
  }, [timePeriod]); //trigger when user changes timePeriod

  //test ok..
  /* useEffect(() => {
    console.log(topTracks);
  }, [topTracks]); */

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

        {/* <h1 className="text-3xl text-white flex justify-center items-center ">
          Hello {session?.user.name}
          <img
            //src="https://user-images.githubusercontent.com/17027312/134349999-06919dce-11f2-42b9-9c0c-2b27d8dcce51.jpeg"
            src={session?.user.image}
            alt="profile dummy pic"
            className="h-10 w-10 rounded-full ml-2"
          />
        </h1> */}
        <h3 className="text-3xl text-white text-center">
          Your most played songs
        </h3>
        <div className="   flex text-white uppercase tracking-wide justify-center space-x-4 mt-2.5 ">
          <h3
            onClick={() => setTimePeriod("short_term")}
            className={`cursor-pointer  border-b-2 ${
              timePeriod == "short_term" ? "border-white" : "border-transparent"
            } `}
          >
            short term
          </h3>
          <h3
            onClick={() => setTimePeriod("medium_term")}
            className={`cursor-pointer  border-b-2 ${
              timePeriod == "medium_term"
                ? "border-white"
                : "border-transparent"
            } `}
          >
            medium term
          </h3>
          <h3
            onClick={() => setTimePeriod("long_term")}
            className={`cursor-pointer  border-b-2 ${
              timePeriod == "long_term" ? "border-white" : "border-transparent"
            } `}
          >
            long term
          </h3>
        </div>
        {/* TOP TRACKS */}
        {/* Research cool design */}
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
