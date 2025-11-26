"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NavigationLinks from "./NavigrationLinks";

const Navigation: React.FC = () => {
  const [navbar, setNavbar] = useState<boolean>(false);

  return (
    <nav className="w-full bg-white shadow">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">

        {/* Logo + mobile toggle */}
        <div className="flex items-center justify-between py-3 md:py-5">
          <Link href="/">
            <h2 className="text-xl text-black font-bold">SPŠT Knižnica</h2>
          </Link>

          <div className="md:hidden">
            <button
              className="p-2 text-gray-700 rounded-md"
              onClick={() => setNavbar(!navbar)}
            >
              {navbar ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <div
          className={`flex-1 pb-3 md:pb-0 md:block ${
            navbar ? "block" : "hidden"
          }`}
        >
          <ul className="items-center justify-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            <NavigationLinks />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
