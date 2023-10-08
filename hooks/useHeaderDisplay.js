import { useState, useEffect } from "react";
import { debounce } from "../lib/debounce";

//Only working on mobile screen??
export default function useHeaderDisplay() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [headerVisible, setVisible] = useState(true);

  const handleScroll = debounce(() => {
    const currentScrollPos = window.scrollY;

    /* last || -> if just a little scroll down, keep Header in place. */
    setVisible(
      (prevState) =>
        (prevScrollPos > currentScrollPos &&
          prevScrollPos - currentScrollPos > 30) ||
        currentScrollPos < 10 ||
        (prevState && currentScrollPos - prevScrollPos < 80) /* 100 */
    );

    //console.log(headerVisible);
    setPrevScrollPos(currentScrollPos);
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, headerVisible, handleScroll]);

  return {
    headerVisible,
  };
}
