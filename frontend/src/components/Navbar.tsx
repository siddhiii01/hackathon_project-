import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {

  return (
    <nav className="w-full fixed bg-gray-50 shadow-amber-50 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <img src="/image.png" className="w-xl ml-4" alt="logo" />
          </div>
          <span className="text-lg font-bold tracking-tight ml-2">DERN</span>
        </Link>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="hidden sm:flex space-x-4">
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-400">Team</a>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-400">Projects</a>
            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-400">Calendar</a>
          </div>

        </div>
      </div>
    </nav>
    
  );
};
