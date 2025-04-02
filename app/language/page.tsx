"use client";

import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/common/layout/GameLayout";
//import WinMessage from "@/components/common/ui/WinMessage";
import { STORAGE_KEYS } from "@/constants";
import LanguageGameGrid from "@/components/language/LanguageGameGrid";
import useLanguages from "@/hooks/language/useLanguages";
import { Language, LanguageGuessResult } from "@/entities/Language";
import useGuessCounts from "@/hooks/language/useGuessCountsLanguage";
import GuessForm from "@/components/forms/GuessForm";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import useDailyLanguage from "@/hooks/language/useDailyLanguage";
import HintSection from "@/components/language/HintSection";
import LoadingScreen from "@/components/common/feedback/LoadingScreen";
import { getTodayDateString, getYesterdayDateString } from "@/lib/utils";

export default function LanguageGame() {
  const { languages, loading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();

  const [yesterdayDate] = useState(() => new Date(getYesterdayDateString()));
  const { dailyLanguage: yesterdayLanguage } = useDailyLanguage(yesterdayDate);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<LanguageGuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = getTodayDateString();

  const hasWon = guesses.some((g) => g.nameMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  const [nameLength, setNameLength] = useState<number | null>(null);
  const [creators, setCreators] = useState<string[] | null>(null);
  // Add a 3rd hint and not a snippet or find a way to not expose syntaxName

  useEffect(() => {
    if (!loading && languages.length > 0) {
      const storedGuesses = loadProgress<LanguageGuessResult[]>(STORAGE_KEYS.LANGUAGE_GUESSES, dayString);
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
      saveProgress<LanguageGuessResult[]>(STORAGE_KEYS.LANGUAGE_GUESSES, dayString, guesses);
    }
  }, [guesses, dayString]);

  const submitGuess = useCallback(async () => {
    if (!guess) return
    try {
      const res = await fetch("/api/guessLanguage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guessedLanguage: guess })
      })
      if (!res.ok) throw new Error("Failed to guess")
      const result: LanguageGuessResult = await res.json()
      result.id = Date.now().toString()
      setGuesses((prev) => [...prev, result])
      incrementGuessCount(guess)
      setGuess("")
      setShowSuggestions(false)
    } catch (err) {
      console.error("Error submitting guess:", err)
    }
  }, [guess, incrementGuessCount])

    const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submitGuess();
  }, [submitGuess]);

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

  useEffect(() => {
    async function fetchHint(hintType: string) {
      const res = await fetch(`/api/hint?hintType=${hintType}`);
      if (!res.ok) return null;
      return await res.json();
    }

    if (guesses.length >= 3 && nameLength === null) {
      fetchHint('nameLength').then(data => setNameLength(data?.nameLength));
    }

    if (guesses.length >= 6 && creators === null) {
      fetchHint('creators').then(data => setCreators(data?.creators));
    }
  }, [guesses, nameLength, creators]);

  if (loading) return <LoadingScreen />;

  return (
    <GameLayout>
      {guesses.length == 0 && !showWinMessage && (
        <p className="text-lg font-semibold p-2">Type any language to begin !</p>
      )}
      <HintSection
        incorrectGuesses={guesses.length}
        letters={nameLength ? nameLength : 0}
        creators={creators ? creators : ["John Smith"]}
      />
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
      {/* Need to fetch once hasWon is true only to not reveal in network tab before */}
      {/* {showWinMessage && todayLanguage && (
        <WinMessage
          language={todayLanguage}
        />
      )} */}
      <LanguageGameGrid guesses={guesses} />
      {yesterdayLanguage && (
        <p className="p-4">
          Yesterday&apos;s language was <strong>{yesterdayLanguage.name}.</strong>
        </p>
      )}
    </GameLayout>
  );
}
