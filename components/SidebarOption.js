import { useRouter } from "next/router";
import React from "react";

function SidebarOption({ Icon, title, url, favoritedItems }) {
  const router = useRouter();
  const { asPath } = useRouter();

  return (
    <div
      className={`sidebarDiv  group   ${favoritedItems && "relative"}`}
      onClick={() => router.push(url)}
    >
      <Icon
        className={`sidebarIcon ${
          asPath === url ? "text-spotifyGreen" : "text-gray-400"
        }  `}
      />
      <p
        className={`${
          asPath === url ? "!text-spotifyGreen" : "text-gray-400"
        }   hoverStyling `}
      >
        {title}
      </p>
      {favoritedItems && (
        <div
          className={`${
            favoritedItems.length == 0 && "hidden"
          } absolute top-0.5 left-9 rounded-full bg-red-500 h-[22px] w-[22px] flex items-center justify-center  `}
        >
          <p className={`text-sm text-white/75  `}>{favoritedItems.length}</p>
        </div>
      )}
    </div>
  );
}

export default SidebarOption;
