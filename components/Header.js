import { signOut } from "next-auth/react";
import React from "react";
import { SocialIcon } from "react-social-icons";
import { useSession } from "next-auth/react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

function Header() {
  const { data: session } = useSession();

  return (
    <div className=" w-screen bg-gray-800  overflow-y-scroll">
      {/* GITHUB + LOGOUT (make component?) */}
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
          src={session?.user?.image}
          alt="profile dummy pic"
          className="h-10 w-10 rounded-full ml-2"
        />
      </h1>
    </div>
  );
}

export default Header;
