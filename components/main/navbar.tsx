"use client";

import { TbHome } from "react-icons/tb";
import { GiKnifeFork } from "react-icons/gi";
import { IoAnalytics } from "react-icons/io5";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 20);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const isActive = (path: string) => {
    if (path === "/home" && pathname === "/home") {
      return true;
    }
    if (path !== "/home" && pathname?.includes(path)) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 z-50 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-around bg-orange p-2 mx-10 mb-4 rounded-xl shadow-lg text-white">
        <button
          className={`p-2 rounded-md transition-colors ${
            isActive("/home") ? "bg-black/15 font-bold" : "hover:bg-black/15"
          }`}
          onClick={() => {
            window.location.href = "/home";
          }}
        >
          <TbHome className="text-2xl" />
        </button>
        <button
          className={`p-2 rounded-md transition-colors ${
            isActive("/home/recommendations")
              ? "bg-black/15 font-bold"
              : "hover:bg-black/15"
          }`}
          onClick={() => {
            window.location.href = "/home/recommendations";
          }}
        >
          <GiKnifeFork className="text-2xl" />
        </button>
        <button
          className={`p-2 rounded-md transition-colors ${
            isActive("/home/analytics")
              ? "bg-black/15 font-bold"
              : "hover:bg-black/15"
          }`}
          onClick={() => {
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
