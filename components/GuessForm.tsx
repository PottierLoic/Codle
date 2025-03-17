"use client";

import React from "react";
import Image from "next/image";
import { Language } from "../hooks/useLanguages";

type GuessFormProps = {
  guess: string;
  onGuessChange: (value: string) => void;
  suggestions: Language[];
  showSuggestions: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onSelectSuggestion: (name: string) => void;
  placeholder?: string;
};

export default function GuessForm({
  guess,
  onGuessChange,
  suggestions,
  showSuggestions,
  onSubmit,
  onSelectSuggestion,
  placeholder = "Enter your guess",
}: GuessFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-6 flex flex-col gap-2 relative">
      <input
        type="text"
        value={guess}
        onChange={(e) => onGuessChange(e.target.value)}
        className="border-2 border-gray-600 bg-gray-800 text-white rounded-lg p-2 w-64 focus:outline-none focus:border-blue-400 transition"
        placeholder={placeholder}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
          {suggestions.map((lang) => (
            <li
              key={lang.name}
              className="p-2 hover:bg-gray-700 cursor-pointer text-white flex items-center gap-2"
              onClick={() => onSelectSuggestion(lang.name)}
            >
              <Image
                src={lang.icon}
                alt={lang.name}
                width={24}
                height={24}
                className="rounded-md"
              />
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
  );
}
