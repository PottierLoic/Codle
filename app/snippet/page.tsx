"use client";

import { useState, useEffect, useCallback } from "react";
import { getTodayDateString, getYesterdayDateString } from "@/lib/utils";
import GameLayout from "@/components/common/layout/GameLayout";
import WinMessage from "@/components/snippet/WinMessage";
import { STORAGE_KEYS } from "@/constants";
import useLanguages from "@/hooks/language/useLanguages";
import usePartialDailySnippet from "@/hooks/snippet/usePartialDailySnippet";
import useFullDailySnippet from "@/hooks/snippet/useFullDailySnippet";
import { Language } from "@/entities/Language";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import { SnippetGuessResult } from "@/entities/Snippet";
import GuessForm from "@/components/forms/GuessForm";
import SnippetGameGrid from "@/components/snippet/SnippetGameGrid";
import SnippetDisplay from "@/components/snippet/SnippetDisplay";
import ChallengeSection from "@/components/snippet/ChallengeSection";
import LoadingScreen from "@/components/common/feedback/LoadingScreen";
import useFullLanguage from "@/hooks/language/useFullLanguage";

export default function SnippetGame() {
  const { languages, loading: languagesLoading } = useLanguages();

  // Initialize yesterday's date and fetch the daily language for it
  const [yesterdayDate] = useState(() => new Date(getYesterdayDateString()));
  const { dailySnippet: yesterdaySnippet } = useFullDailySnippet(yesterdayDate);
  const [yesterdaySnippetLanguage, setYesterdaySnippetLanguage] = useState<Language | null>(null);

  // states for user input, guesses, and suggestions
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<SnippetGuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = getTodayDateString();

  // states for the partial daily snippet
  const { dailySnippet: partialDailySnippet } = usePartialDailySnippet(new Date(dayString));

  // states for the full daily snippet
  const [todaySnippetDate, setTodaySnippetDate] = useState<Date | null>(null); // TODO fix repetitive fetchs
  const { dailySnippet: fullDailySnippet } = useFullDailySnippet(todaySnippetDate);
  const languageId = fullDailySnippet?.language_id ?? null;
  const { language: snippetLanguage } = useFullLanguage(languageId);


  // Check if the user has won and manage win message visibility
  const hasWon = guesses.some((g) => g.languageMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  // Challenge mode states
  const [enableSyntaxHighlighting, setEnableSyntaxHighlighting] = useState(false);

  useEffect(() => {
    if (!languagesLoading) {
      const storedGuesses = loadProgress<SnippetGuessResult[]>(STORAGE_KEYS.SNIPPET_GUESSES, dayString);
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
  }, [languagesLoading, dayString]);

  useEffect(() => {
    if (guesses.length > 0) {
      saveProgress<SnippetGuessResult[]>(STORAGE_KEYS.SNIPPET_GUESSES, dayString, guesses);
    }
  }, [guesses, dayString]);

  // Submit a guess to the server
  const submitGuess = useCallback(async () => {
    if (!guess) return;
    try {
      const res = await fetch("/api/guessSnippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guessedLanguage: guess })
      });
      if (!res.ok) throw new Error("Failed to guess");
      const result: SnippetGuessResult = await res.json();
      result.id = Date.now().toString();
      setGuesses((prev) => [...prev, result]);
      setGuess("");
      setShowSuggestions(false);
    } catch (err) {
      console.error("Error submitting guess:", err);
    }
  }, [guess]);

  // Handle form submission
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
    if (yesterdaySnippet && languages.length > 0) {
      const foundLanguage = languages.find(lang => lang.id === yesterdaySnippet.language_id);
      setYesterdaySnippetLanguage(foundLanguage || null);
    }
  }, [yesterdaySnippet, languages]);

  // Set today's snippet date if the user has won
  useEffect(() => {
    if (hasWon && !fullDailySnippet) {
      setTodaySnippetDate(new Date(getTodayDateString()));
    }
  }, [hasWon, fullDailySnippet]);

  if (languagesLoading) return <LoadingScreen />;

  return (
    <GameLayout>
      <ChallengeSection
        enableSyntaxHighlighting={enableSyntaxHighlighting}
        setEnableSyntaxHighlighting={setEnableSyntaxHighlighting}
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
      {showWinMessage && fullDailySnippet && snippetLanguage && (
        <WinMessage language={snippetLanguage} snippet={fullDailySnippet} />
      )}
      {partialDailySnippet && (
        <SnippetDisplay
          snippet={partialDailySnippet}
          syntaxName={"todo"} // TODO review this because it would leak the language in network tab
          enableSyntaxHighlighting={enableSyntaxHighlighting}
        />
      )}
      <SnippetGameGrid guesses={guesses} />
      {yesterdaySnippetLanguage && (
        <p className="p-4">
          Yesterday&apos;s snippet was written in <strong>{yesterdaySnippetLanguage.name}.</strong>
        </p>
      )}
    </GameLayout>
  );
}