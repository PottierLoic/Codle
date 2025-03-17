"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Codle!</h1>
      <p className="text-lg text-gray-300 mb-8">Choose a game mode:</p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/lang")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition"
        >
          Guess the Programming Language
        </button>
        <button
          onClick={() => router.push("/code-guess")}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition"
        >
          Guess the language based on code snippet
        </button>
        <button
          onClick={() => router.push("/todo")}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-purple-600 transition"
        >
          Guess game 3
        </button>
      </div>
    </div>
  );
}
