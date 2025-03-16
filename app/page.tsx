"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import GameGrid from "../components/GameGrid";
import { languages } from "../data/languages";
import { compareGuess, Language, GuessResult } from "../lib/gameLogic";

export default function Home() {
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * languages.length);
    setTargetLanguage(languages[randomIndex]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess && targetLanguage) {
      const result = compareGuess(guess, targetLanguage, languages);
      if (result) {
        setGuesses([...guesses, result]);
        setGuess("");
      }
    }
  };

  const hasWon = guesses.some((g) => g.nameMatch);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4">
        {!hasWon && (
          <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="border-2 border-gray-600 bg-gray-800 text-white rounded-lg p-2 w-64 focus:outline-none focus:border-blue-400 transition"
              placeholder="Enter a language"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </form>
        )}
        <GameGrid guesses={guesses} maxGuesses={Infinity} targetLanguage={targetLanguage} />
      </main>
    </div>
  );
}
