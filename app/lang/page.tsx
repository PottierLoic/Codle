"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import GameGrid from "../../components/GameGrid";
import useLanguages, { Language } from "../../hooks/useLanguages";
import useGuessCounts from "../../hooks/useGuessCountsLang";
import { compareGuess, GuessResult } from "../../lib/gameLogic";
import GuessForm from "../../components/GuessForm";
import { getDailyRandomItem } from "../../lib/getDailyRandomItem";

export default function LangGame() {
  const { languages, loading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();
  const [todayLanguage, setTodayLanguage] = useState<Language | null>(null);
  const [yesterdayLanguage, setYesterdayLanguage] = useState<Language | null>(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!loading && languages.length > 0) {
      const dailyPick = getDailyRandomItem(languages);
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayPick = getDailyRandomItem(languages, yesterdayDate);
      setTodayLanguage(dailyPick);
      setYesterdayLanguage(yesterdayPick);
    }
  }, [loading, languages]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (guess && todayLanguage) {
      const result = compareGuess(guess, todayLanguage, languages);
      if (result) {
        setGuesses((prev) => [...prev, result]);
        incrementGuessCount(guess);
        setGuess("");
        setShowSuggestions(false);
      }
    }
  },[guess, todayLanguage, languages, incrementGuessCount]);

  const handleGuessChange = (value: string) => {
    setGuess(value);
    if (value.length > 0) {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().startsWith(value.toLowerCase())
      );
      const notGuessed = filtered.filter(
        (lang) => !guesses.some((g) => g.name === lang.name)
      );
      setSuggestions(notGuessed);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (guess && !showSuggestions) {
      handleSubmit();
    }
  }, [guess, showSuggestions, handleSubmit]);

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
          <GuessForm
            guess={guess}
            onGuessChange={handleGuessChange}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onSubmit={handleSubmit}
            onSelectSuggestion={handleSelectSuggestion}
            placeholder="Enter a language"
          />
        )}
        <GameGrid guesses={guesses} maxGuesses={Infinity} />
        {yesterdayLanguage && (
          <p>
            Yesterday&apos;s Language Was <strong>{yesterdayLanguage.name}</strong>
          </p>
        )}
      </main>
    </div>
  );
}
