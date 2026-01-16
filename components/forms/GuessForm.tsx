"use client";

import React from "react";
import Image from "next/image";
import { Language } from "@/entities/Language";

type GuessFormProps = {
  guess: string;
  onGuessChange: (value: string) => void;
  suggestions: Language[];
  showSuggestions: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onSelectSuggestion: (name: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function GuessForm({
  guess,
  onGuessChange,
  suggestions,
  showSuggestions,
  onSubmit,
  onSelectSuggestion,
  placeholder = "Enter your guess",
  disabled = false,
}: GuessFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg m-3 relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm sm:text-base focus-ring transition placeholder:text-white/40"
          placeholder={placeholder}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-[48px] z-50 max-h-64 overflow-auto rounded-xl border border-white/15 bg-black/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {suggestions.map((lang) => (
              <li
                key={lang.name}
                className="
                  flex items-center gap-2 px-3 py-2 text-sm sm:text-base
                  cursor-pointer
                  hover:bg-white/8
                  border-b border-white/5 last:border-b-0
                "
                onClick={() => onSelectSuggestion(lang.name)}
              >
                <div
                  className="
                    flex items-center justify-center
                    w-7 h-7
                    rounded-md
                    bg-white/90
                    border border-black/10
                    shrink-0
                  "
                >
                  <Image
                    src={lang.icon}
                    alt={lang.name}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <span className="text-white/95">{lang.name}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          className={`btn btn-primary focus-ring px-4 py-2 text-sm sm:text-base ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
