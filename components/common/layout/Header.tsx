"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="w-full sm:w-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Image
              src="/codle-icon-512x512.png"
              alt="Codle Icon"
              width={36}
              height={36}
              className="inline-block"
            />
            <Link href="/" className="hover:text-blue-400 transition">
              Codle
            </Link>
          </h1>
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row gap-4 text-center sm:text-left w-full sm:w-auto`}
        >
          <ul className="flex flex-col sm:flex-row gap-4">
            {[
              { name: "Language", path: "/language" },
              { name: "Code Snippet", path: "/snippet" },
              { name: "🥳Regex", path: "/regex" },
            ].map(({ name, path }) => (
              <li key={path}>
                <Link
                  href={path}
                  className={`transition ${
                    pathname === path
                      ? "text-blue-400 font-bold"
                      : "hover:text-blue-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}