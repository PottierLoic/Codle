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
              <Link href="/lang" className="hover:text-blue-400 transition">
                Languages
              </Link>
            </li>
            <li className="text-gray-500 cursor-not-allowed">
              <Link href="/code-guess" className="hover:text-blue-400 transition">
                Code Snippets
              </Link>
            </li>
            <li className="text-gray-500 cursor-not-allowed">
              <Link href="/todo" className="hover:text-blue-400 transition">
                Game 3
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
