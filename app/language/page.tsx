"use client";

import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/common/layout/GameLayout";
import WinMessage from "@/components/language/WinMessage";
import { STORAGE_KEYS } from "@/constants";
import LanguageGameGrid from "@/components/language/LanguageGameGrid";
import useLanguages from "@/hooks/language/useLanguages";
import { Language, LanguageGuessResult } from "@/entities/Language";
import GuessForm from "@/components/forms/GuessForm";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import useDailyLanguage from "@/hooks/language/useDailyLanguage";
import HintSection from "@/components/language/HintSection";
import LoadingScreen from "@/components/common/feedback/LoadingScreen";
import { getTodayDateString, getYesterdayDateString } from "@/lib/utils";
import { fetchLanguageHint, submitLanguageGuess } from "@/services/languageService";

export default function LanguageGame() {
  const { languages, loading } = useLanguages();

  // Initialize yesterday's date and fetch the daily language for it
  const [yesterdayDate] = useState(() => new Date(getYesterdayDateString()));
  const { dailyLanguage: yesterdayLanguage } = useDailyLanguage({date: yesterdayDate, enabled: true});

  // State for user input, guesses, and suggestions
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<LanguageGuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = getTodayDateString();

  // Check if the user has won and manage win message visibility
  const hasWon = guesses.some((g) => g.nameMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  // State for hints
  const [nameLength, setNameLength] = useState<number | null>(null);
  const [creators, setCreators] = useState<string[] | null>(null);

  // State for today's language
  const [todayDate] = useState(() => new Date(getTodayDateString()));
  const { dailyLanguage: todayLanguage } = useDailyLanguage({date: todayDate, enabled: hasWon});

  // States to disable the button during submissions animation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const revealDuration = 3500;

  // Load progress from storage when the component mounts
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

  // Save progress to storage whenever guesses change
  useEffect(() => {
    if (guesses.length > 0) {
      saveProgress<LanguageGuessResult[]>(STORAGE_KEYS.LANGUAGE_GUESSES, dayString, guesses);
    }
  }, [guesses, dayString]);

  // Submit a guess to the server
  const submitGuess = useCallback(async () => {
    if (!guess || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await submitLanguageGuess(guess);
      result.id = Date.now().toString();
      setGuesses((prev) => [...prev, result]);
      setGuess("");
      setShowSuggestions(false);
    } catch (err) {
      console.error("Error submitting guess:", err);
    } finally {
      setTimeout(() => setIsSubmitting(false), revealDuration);
    }
  }, [guess, isSubmitting]);

  // Handle form submission
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submitGuess();
  }, [submitGuess]);

  // Handle guess input changes and update suggestions
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

  // Handle selecting a suggestion from the dropdown
  const handleSelectSuggestion = useCallback((name: string) => {
    setGuess(name);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  // Show the win message after a delay if the user has won
  useEffect(() => {
    if (hasWon) {
      const timer = setTimeout(() => {
        setShowWinMessage(true);
      }, revealDuration);
      return () => clearTimeout(timer);
    } else {
      setShowWinMessage(false);
    }
  }, [hasWon]);

  // Fetch hints based on the number of incorrect guesses
  useEffect(() => {
    async function fetchHint() {
      if (guesses.length >= 3 && !nameLength) {
        const data = await fetchLanguageHint("nameLength");
        setNameLength(data?.nameLength ?? null);
      }
      if (guesses.length >= 5 && !creators) {
        const data = await fetchLanguageHint("creators");
        setCreators(data?.creators ?? null);
      }
    }
    fetchHint();
  }, [guesses, nameLength, creators]);

  if (loading) return <LoadingScreen />;

  return (
    <GameLayout>
      {guesses.length == 0 && !showWinMessage && (
        <p className="text-lg font-semibold p-2">Type any language to begin !</p>
      )}
      <HintSection
        incorrectGuesses={hasWon ? 9 : guesses.length}
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
          disabled={isSubmitting}
        />
      )}
      {showWinMessage && todayLanguage && (
        <WinMessage
          language={todayLanguage}
        />
      )}
      <LanguageGameGrid guesses={guesses} />
      {yesterdayLanguage && (
        <p className="p-4">
          Yesterday&apos;s language was <strong>{yesterdayLanguage.name}.</strong>
        </p>
      )}
    </GameLayout>
  );
}
