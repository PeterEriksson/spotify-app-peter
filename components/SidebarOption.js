import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import styles from "../styles/effects.module.css";

function SidebarOption({ Icon, title, url, favoritedItems }) {
  const { asPath } = useRouter();

  const [pressed, setPressed] = React.useState(false);

  return (
    <Link href={url}>
      <div
        onMouseDown={() => setPressed(true)}
        onMouseUpCapture={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className={`   sidebarOption group  ${favoritedItems && "relative"}`}
      >
        <Icon
          className={`${
            pressed && "xxs:scale-90 transform transition duration-100 ease-in"
          } ${styles.iconMobile}  sidebarIcon ${
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

        {favoritedItems?.length > 0 && (
          <div
            className={`${
              favoritedItems.length == 0 && "hidden"
            } pointer-events-none  absolute top-0.5 left-2 xxs:left-10 rounded-full bg-red-500 h-[22px] w-[22px] flex items-center justify-center  `}
          >
            <p className={`text-sm text-white/75  pointer-events-none`}>
              {favoritedItems.length}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default SidebarOption;
