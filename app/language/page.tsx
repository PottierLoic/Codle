"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageGameGrid from "@/components/LanguageGameGrid";
import useLanguages, { Language } from "@/hooks/useLanguages";
import useGuessCounts from "@/hooks/useGuessCountsLanguage";
import { compareGuess, GuessResult } from "@/lib/languageLogic";
import GuessForm from "@/components/GuessForm";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import useDailyLanguage from "@/hooks/useDailyLanguage";
import Timer from "@/components/Timer";
import HintSection from "@/components/HintSectionLanguage";
import useSnippet from "@/hooks/useSnippet";

export default function LanguageGame() {
  const { languages, loading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();

  const { dailyLanguage: todayLanguage } = useDailyLanguage();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const { dailyLanguage: yesterdayLanguage } = useDailyLanguage(yesterdayDate);

  const { snippet } = useSnippet(todayLanguage?.id ?? null);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = new Date().toISOString().slice(0, 10);

  const hasWon = guesses.some((g) => g.nameMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    if (!loading && languages.length > 0) {
      const storedGuesses = loadProgress<GuessResult[]>("languageGuesses", dayString);
      if (storedGuesses) {
        storedGuesses.forEach(g => {
          g.isFromStorage = true;
        });
        setGuesses(storedGuesses);
        if (storedGuesses.some((g) => g.nameMatch)) {
          setShowWinMessage(true);
        }
      }
    }
  }, [loading, languages, dayString]);

  useEffect(() => {
    if (guesses.length > 0) {
      saveProgress<GuessResult[]>("languageGuesses", dayString, guesses);
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
  }, [guess, todayLanguage, languages, incrementGuessCount]);

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

  useEffect(() => {
    if (hasWon) {
      const timer = setTimeout(() => {
        setShowWinMessage(true);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setShowWinMessage(false);
    }
  }, [hasWon]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4">
        {guesses.length == 0 && !showWinMessage && (
          <p className="text-lg font-semibold p-2">Type any language to begin !</p>
        )}
        {todayLanguage && (
          <HintSection
            incorrectGuesses={guesses.length}
            letters={todayLanguage ? todayLanguage.name.length : 0}
            creators={todayLanguage ? todayLanguage.creators : []}
            snippet={snippet ? snippet : null}
            syntaxName={todayLanguage ? todayLanguage?.syntax_name : ""}
          />
        )}
        {!showWinMessage && (
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
        {showWinMessage && todayLanguage && (
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
            <Timer />
          </div>
        )}
        <LanguageGameGrid guesses={guesses} />
        {yesterdayLanguage && (
          <p className="p-4">
            Yesterday&apos;s language was <strong>{yesterdayLanguage.name}.</strong>
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
