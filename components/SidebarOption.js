import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import styles from "../styles/effects.module.css";

function SidebarOption({ Icon, title, url, favoritedItems }) {
  const { asPath } = useRouter();
  const [iconPressed, setIconPressed] = React.useState(false);

  return (
    <Link href={url}>
      <div
        onMouseDown={() => {
          setIconPressed(true);
        }}
        onMouseUpCapture={() => setIconPressed(false)}
        onMouseLeave={() => setIconPressed(false)}
        className={`  sidebarOption group  ${favoritedItems && "relative"}`}
      >
        <Icon
          className={`${iconPressed && styles.sidebarIconEffect}  sidebarIcon ${
            asPath === url ? "text-spotifyGreen" : "text-gray-400"
          }  `}
        />
        <p
          className={`${
            asPath === url ? "!text-spotifyGreen" : "text-gray-400"
          }   hidden xxs:inline`}
        >
          {title}
        </p>
        {favoritedItems && (
          <div
            className={`${
              favoritedItems.length == 0 && "hidden"
            } absolute top-0.5 left-2 xxs:left-10 rounded-full bg-red-500 h-[22px] w-[22px] flex items-center justify-center  `}
          >
            <p className={`text-sm text-white/75  `}>{favoritedItems.length}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default SidebarOption;
