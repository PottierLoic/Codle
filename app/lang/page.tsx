"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import GameGrid from "../../components/GameGrid";
import useLanguages, { Language } from "../../hooks/useLanguages";
import useGuessCounts from "../../hooks/useGuessCountsLang";
import { compareGuess, GuessResult } from "../../lib/gameLogic";
import GuessForm from "../../components/GuessForm";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import useDailyLanguage from "@/hooks/useDailyLanguage";

export default function LangGame() {
  const { languages, loading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();

  const { dailyLanguage: todayLanguage } = useDailyLanguage();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const { dailyLanguage: yesterdayLanguage } = useDailyLanguage(yesterdayDate);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!loading && languages.length > 0) {
      const storedGuesses = loadProgress<GuessResult[]>("langGuesses", dayString);
      if (storedGuesses) {
        storedGuesses.forEach(g => {
          g.isFromStorage = true;
        });
        setGuesses(storedGuesses);
      }
    }
  }, [loading, languages, dayString]);

  useEffect(() => {
    if (guesses.length > 0) {
      saveProgress<GuessResult[]>("langGuesses", dayString, guesses);
    }
  }, [guesses, dayString]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (guess && todayLanguage) {
      const result = compareGuess(guess, todayLanguage, languages);
      if (result) {
        result.id = Date.now().toString()
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
        {hasWon && todayLanguage && (
          <div className="mt-4 p-2 bg-gray-800 rounded">
            <h2 className="text-xl font-semibold mb-2">Congratulations, today&apos;s language is <strong>{todayLanguage.name}</strong> !</h2>
            <p className="mb-2">{todayLanguage.description}</p>
            {todayLanguage.link && (
              <a
                href={todayLanguage.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Learn more about {todayLanguage.name}
              </a>
            )}
          </div>
        )}
        <GameGrid guesses={guesses} maxGuesses={Infinity} />
        {yesterdayLanguage && (
          <p>
            Yesterday&apos;s language was <strong>{yesterdayLanguage.name}.</strong>
          </p>
        )}
      </main>
    </div>
  );
}
