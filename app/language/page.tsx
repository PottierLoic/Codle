"use client";

import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/common/layout/GameLayout";
import WinMessage from "@/components/common/ui/WinMessage";
import { STORAGE_KEYS } from "@/constants";
import LanguageGameGrid from "@/components/language/LanguageGameGrid";
import useLanguages from "@/hooks/useLanguages";
import { Language, LanguageGuessResult } from "@/entities/Language";
import useGuessCounts from "@/hooks/useGuessCountsLanguage";
import { compareGuess } from "@/lib/languageLogic";
import GuessForm from "@/components/forms/GuessForm";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import useDailyLanguage from "@/hooks/useDailyLanguage";
import HintSection from "@/components/language/HintSection";
import useSnippet from "@/hooks/useSnippet";
import LoadingScreen from "@/components/common/feedback/LoadingScreen";
import { getTodayString, getYesterdayString } from "@/lib/utils";

export default function LanguageGame() {
  const { languages, loading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();

  const { dailyLanguage: todayLanguage } = useDailyLanguage();
  const yesterdayDate = new Date(getYesterdayString());
  const { dailyLanguage: yesterdayLanguage } = useDailyLanguage(yesterdayDate);

  const { snippet } = useSnippet(todayLanguage?.id ?? null);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<LanguageGuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = getTodayString();

  const hasWon = guesses.some((g) => g.nameMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

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

  if (loading) return <LoadingScreen />;

  return (
    <GameLayout>
      {guesses.length == 0 && !showWinMessage && (
        <p className="text-lg font-semibold p-2">Type any language to begin !</p>
      )}
      {todayLanguage && (
        <HintSection
          incorrectGuesses={guesses.length}
          letters={todayLanguage.name.length}
          creators={todayLanguage.creators}
          snippet={snippet}
          syntaxName={todayLanguage.syntax_name}
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
        <WinMessage
          name={todayLanguage.name}
          description={todayLanguage.description}
          link={todayLanguage.link}
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
