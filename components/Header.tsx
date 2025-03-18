import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-blue-400 transition">
            Codle
          </Link>
        </h1>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/language" className="hover:text-blue-400 transition">
                Language
              </Link>
            </li>
            <li className="text-gray-500 cursor-not-allowed">
              <Link href="/snippet" className="hover:text-blue-400 transition">
                Code Snippet
              </Link>
            </li>
            <li className="text-gray-500 cursor-not-allowed">
              <Link href="/logo" className="hover:text-blue-400 transition">
                Logo
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
