"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const links = [
    { name: "Language", path: "/language" },
    { name: "Code Snippet", path: "/snippet" },
    { name: "Regex", path: "/regex" },
    { name: "Complexity", path: "/complexity" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="app-container">
        <div className="glass px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 font-semibold tracking-tight focus-ring rounded-lg px-2 py-1"
            >
              <Image
                src="/codle-icon-512x512.png"
                alt="Codle"
                width={34}
                height={34}
                className="inline-block"
                priority
              />
              <span className="text-lg sm:text-xl">Codle</span>
            </Link>

            <button
              className="sm:hidden btn focus-ring px-3 py-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
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

            <nav className="hidden sm:block">
              <ul className="flex items-center gap-2">
                {links.map(({ name, path }) => {
                  const active = pathname === path;
                  return (
                    <li key={path}>
                      <Link
                        href={path}
                        className={`focus-ring rounded-lg px-3 py-2 text-sm transition ${
                          active
                            ? "bg-white/10 border border-white/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <nav className={`${isMenuOpen ? "block" : "hidden"} sm:hidden mt-3`}>
            <ul className="grid gap-2">
              {links.map(({ name, path }) => {
                const active = pathname === path;
                return (
                  <li key={path}>
                    <Link
                      href={path}
                      className={`block focus-ring rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-white/10 border border-white/10"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
