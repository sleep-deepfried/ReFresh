"use client";

import { TbHome } from "react-icons/tb";
import { GiKnifeFork } from "react-icons/gi";
import { IoAnalytics } from "react-icons/io5";
import { useState, useEffect } from "react";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 z-50 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-around bg-orange p-2 mx-10 mb-4 rounded-xl shadow-lg text-white">
        <button
          className="p-2 hover:bg-black/15 rounded-md transition-colors"
          onClick={() => {
            console.log("Navigating to Home");
            window.location.href = "/home";
          }}
        >
          <TbHome className="text-2xl" />
        </button>
        <button
          className="p-2 hover:bg-black/15 rounded-md transition-colors"
          onClick={() => {
            console.log("Navigating to recommendations");
            window.location.href = "/home/recommendations";
          }}
        >
          <GiKnifeFork className="text-2xl" />
        </button>
        <button
          className="p-2 hover:bg-black/15 rounded-md transition-colors"
          onClick={() => {
            console.log("Navigating to recommendations");
            window.location.href = "/home/analytics";
          }}
        >
          <IoAnalytics className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
