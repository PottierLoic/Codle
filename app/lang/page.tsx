"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import GameGrid from "../../components/GameGrid";
import useLanguages from "../../hooks/useLanguages";
import { Language } from "../../hooks/useLanguages";
import { compareGuess, GuessResult } from "../../lib/gameLogic";

export default function LangGame() {
  const { languages, loading } = useLanguages();
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!loading && languages.length > 0) {
      const randomIndex = Math.floor(Math.random() * languages.length);
      setTargetLanguage(languages[randomIndex]);
    }
  }, [loading, languages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (guess && targetLanguage) {
      const result = compareGuess(guess, targetLanguage, languages);
      if (result) {
        setGuesses([...guesses, result]);
        setGuess("");
        setShowSuggestions(false);
      }
    }
  };

  useEffect(() => {
    if (guess && !showSuggestions) {
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setGuess(input);
    if (input.length > 0) {
      const filtered = languages.filter(lang =>
        lang.name.toLowerCase().startsWith(input.toLowerCase()) &&
        !guesses.some(g => g.name === lang.name)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    setGuess(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const hasWon = guesses.some((g) => g.nameMatch);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4">
        {!hasWon && (
          <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 relative">
            <input
              type="text"
              value={guess}
              onChange={handleInputChange}
              className="border-2 border-gray-600 bg-gray-800 text-white rounded-lg p-2 w-64 focus:outline-none focus:border-blue-400 transition"
              placeholder="Enter a language"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-12 left-0 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                {suggestions.map((lang) => (
                  <li
                    key={lang.name}
                    className="p-2 hover:bg-gray-700 cursor-pointer text-white flex items-center gap-2"
                    onClick={() => handleSelectSuggestion(lang.name)}
                  >
                    <img src={lang.icon} alt={lang.name} className="w-6 h-6 rounded-md" />
                    {lang.name}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </form>
        )}
        <GameGrid guesses={guesses} maxGuesses={Infinity} />
      </main>
    </div>
  );
}
