"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4 h-16">
      {" "}
      {/* Define a altura da navbar */}
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="text-white text-xl font-bold">Gestão de Gado</div>
        <div className="flex space-x-4 h-full items-center">
          <Link href="/dashboard">
            <div className="text-gray-300 hover:text-white h-full flex items-center px-4">
              Dashboard
            </div>
          </Link>
          <Link href="/matrizes">
            <div className="text-gray-300 hover:text-white h-full flex items-center px-4">
              Matrizes
            </div>
          </Link>
          {/* Dropdown for "Filhotes" */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-gray-300 hover:text-white h-full flex items-center px-4 cursor-pointer">
              Filhotes
            </div>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-16 w-48 bg-white rounded-md shadow-lg z-10">
                <Link
                  href="/filhotes"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Todos os Filhotes
                </Link>
                <Link
                  href="/desmama"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Desmama
                </Link>
              </div>
            )}
          </div>
          <Link href="/machos">
            <div className="text-gray-300 hover:text-white h-full flex items-center px-4">
              Machos
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
