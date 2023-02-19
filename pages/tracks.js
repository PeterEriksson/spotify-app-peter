import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Sidebar from "../components/Sidebar";
import useSpotify from "../hooks/useSpotify";

export default function tracks() {
  const spotifyApi = useSpotify();
  const [topTracks, setTopTracks] = useState([]);

  const { data: session } = useSession();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyTopTracks()
        .then((data) => setTopTracks(data.body.items))
        .catch((err) => console.log(err));
    }
  }, []);

  //test ok..
  useEffect(() => {
    console.log(topTracks);
  }, [topTracks]);

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

        <h1 className="text-3xl text-white flex justify-center items-center ">
          Hello {session?.user.name}
          <img
            //src="https://user-images.githubusercontent.com/17027312/134349999-06919dce-11f2-42b9-9c0c-2b27d8dcce51.jpeg"
            src={session?.user.image}
            alt="profile dummy pic"
            className="h-10 w-10 rounded-full ml-2"
          />
        </h1>
        <h3 className="text-lg text-white text-center">
          Your most played songs
        </h3>
        {/* TOP TRACKS */}
        {topTracks?.slice(0, 10).map((topTrack, i) => (
          <h2 key={i}>{topTrack.name}</h2>
        ))}
      </div>
    </div>
  );
}

//when refreshing the page -> data is not shown. solution ->
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
