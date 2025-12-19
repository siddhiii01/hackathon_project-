import React, { useState } from "react";

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative bg-blue-50 shadow-amber-50  z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Logo"
          />
        </div>
        <div className="hidden sm:flex space-x-4">
          <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Team</a>
          <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Projects</a>
          <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Calendar</a>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <span className="sr-only">Open main menu</span>
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-900">Dashboard</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Team</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Projects</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Calendar</a>
        </div>
      )}
    </nav>
  );
};
