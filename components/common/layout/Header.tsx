"use-client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Image
            src="/codle-icon-512x512.png"
            alt="Codle Icon"
            width={48}
            height={48}
            className="inline-block"
          />
          <Link href="/" className="hover:text-blue-400 transition">
            Codle
          </Link>
        </h1>
        <nav>
          <ul className="flex gap-4">
            {[
              { name: "Language", path: "/language" },
              { name: "Code Snippet", path: "/snippet" },
              { name: "🥳Regex", path: "/regex" }
            ].map(({ name, path }) => (
              <li key={path}>
                <Link
                  href={path}
                  className={`transition ${
                    pathname === path ? "text-blue-400 font-bold" : "hover:text-blue-400"
                  }`}
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
