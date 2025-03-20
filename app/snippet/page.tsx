"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import useLanguages from "@/hooks/useLanguages";
import useGuessCounts from "../../hooks/useGuessCountsSnippet";
import useDailySnippet from "@/hooks/useDailySnippet";
import { Language } from "../../hooks/useLanguages";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import { compareGuess, GuessResult } from "../../lib/snippetLogic";
import GuessForm from "@/components/GuessForm";
import SnippetGameGrid from "@/components/SnippetGameGrid";
import SnippetDisplay from "@/components/SnippetDisplay";
import Timer from "@/components/Timer";

export default function SnippetGame() {
  const { languages, loading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();

  const { dailySnippet: todaySnippet } = useDailySnippet();
  const [yesterdayDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  });
  const { dailySnippet: yesterdaySnippet } = useDailySnippet(yesterdayDate);

  const [snippetLanguage, setSnippetLanguage] = useState<Language | null>(null);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = new Date().toISOString().slice(0, 10);

  const hasWon = guesses.some((g) => g.languageMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    if (!loading) {
      const storedGuesses = loadProgress<GuessResult[]>("snippetGuesses", dayString);
      if (storedGuesses) {
        storedGuesses.forEach(g => {
          g.isFromStorage = true;
        });
        setGuesses(storedGuesses);
        if (storedGuesses.some((g) => g.languageMatch)) {
          setShowWinMessage(true);
        }
      }
    }
  }, [loading, dayString]);

  useEffect(() => {
    if (guesses.length > 0) {
      saveProgress<GuessResult[]>("snippetGuesses", dayString, guesses);
    }
  }, [guesses, dayString]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (guess && todaySnippet) {
      const result = compareGuess(guess, todaySnippet, languages);
      if (result) {
        result.id = Date.now().toString()
        setGuesses((prev) => [...prev, result]);
        incrementGuessCount(guess);
        setGuess("");
        setShowSuggestions(false);
      }
    }
  }, [guess, todaySnippet, languages, incrementGuessCount]);

  const handleGuessChange = (value: string) => {
    setGuess(value);
    if (value.length > 0) {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().startsWith(value.toLowerCase())
      );
      const notGuessed = filtered.filter(
        (lang) => !guesses.some((g) => g.language === lang.name)
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
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowWinMessage(false);
    }
  }, [hasWon]);

  useEffect(() => {
    if (todaySnippet && languages.length > 0) {
      const foundLanguage = languages.find(lang => lang.name === todaySnippet.language);
      setSnippetLanguage(foundLanguage || null);
    }
  }, [todaySnippet, languages]);

  return (
     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center p-4">
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
            {showWinMessage && todaySnippet && snippetLanguage && (
              <div className="mt-4 p-2 bg-gray-800 rounded">
                <h2 className="text-xl font-semibold mb-2">Congratulations, today&apos;s snippet is written in <strong>{todaySnippet.language}</strong> !</h2>
                <p className="mb-2">{snippetLanguage.description}</p>
                {snippetLanguage.link && (
                  <a
                    href={snippetLanguage.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    Learn more about {snippetLanguage.name}
                  </a>
                )}
                <Timer />
              </div>
            )}
            {todaySnippet && <SnippetDisplay snippet={todaySnippet} syntaxName={snippetLanguage?.syntaxName} />}
            <SnippetGameGrid guesses={guesses} />
            {yesterdaySnippet && (
              <p>
                Yesterday&apos;s snippet was written in <strong>{yesterdaySnippet.language}.</strong>
              </p>
            )}
          </main>
          <Footer />
        </div>
  )
}