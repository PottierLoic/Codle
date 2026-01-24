"use client";

import { useState, useEffect, useCallback } from "react";
import { getTodayDateString, getYesterdayDateString } from "@/lib/utils";
import GameLayout from "@/components/common/layout/GameLayout";
import WinMessage from "@/components/snippet/WinMessage";
import { STORAGE_KEYS } from "@/constants";
import useLanguages from "@/hooks/language/useLanguages";
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
import { fetchSnippetCode, submitSnippetGuess } from "@/services/snippetService";

export default function SnippetGame() {
  const { languages, loading: languagesLoading } = useLanguages();

  // Initialize yesterday's date and fetch the daily language for it
  const [yesterdayDate] = useState(() => new Date(getYesterdayDateString()));
  const { dailySnippet: yesterdaySnippet } = useFullDailySnippet({date: yesterdayDate, enabled: true});
  const [yesterdaySnippetLanguage, setYesterdaySnippetLanguage] = useState<Language | null>(null);

  // states for user input, guesses, and suggestions
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<SnippetGuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = getTodayDateString();

  // states for the partial daily snippet
  const [snippetCode, setSnippetCode] = useState<string | null>(null);
  const [loadingSnippet, setLoadingSnippet] = useState(true);

  // Check if the user has won and manage win message visibility
  const hasWon = guesses.some((g) => g.languageMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  // states for the full daily snippet
  const [todayDate] = useState(() => new Date(getTodayDateString()));
  const { dailySnippet: fullDailySnippet } = useFullDailySnippet({date: todayDate, enabled: hasWon});
  const languageId = fullDailySnippet?.language_id ?? null;
  const { language: snippetLanguage } = useFullLanguage(languageId);

  // Challenge mode states
  const [enableSyntaxHighlighting, setEnableSyntaxHighlighting] = useState(false);

  // States to disable the button during submissions animation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const revealDuration = 500;

  // fetch the daily snippet code from the server
  useEffect(() => {
    const fetchCode = async () => {
      try {
        const { code } = await fetchSnippetCode();
        setSnippetCode(code);
      } catch (err) {
        console.error("[ERROR] Failed to fetch snippet code:", err);
      } finally {
        setLoadingSnippet(false);
      }
    };
    fetchCode();
  }, []);

  // Load progress from storage when the component mounts
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

  // Save progress to storage whenever guesses change
  useEffect(() => {
    if (guesses.length > 0) {
      saveProgress<SnippetGuessResult[]>(STORAGE_KEYS.SNIPPET_GUESSES, dayString, guesses);
    }
  }, [guesses, dayString]);

  // Submit a guess to the server
  const submitGuess = useCallback(async () => {
    if (!guess || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await submitSnippetGuess(guess);
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
  const handleGuessChange = useCallback((value: string) => {
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
  }, [languages, guesses]);

  // Handle selecting a suggestion from the dropdown
  const handleSelectSuggestion = (name: string) => {
    setGuess(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Show the win message after a delay if the user has won
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

  // Set yesterday's snippet language if it exists and languages are loaded
  useEffect(() => {
    if (yesterdaySnippet && languages.length > 0) {
      const foundLanguage = languages.find(lang => lang.id === yesterdaySnippet.language_id);
      setYesterdaySnippetLanguage(foundLanguage || null);
    }
  }, [yesterdaySnippet, languages]);

  if (languagesLoading || loadingSnippet) return <LoadingScreen />;

  return (
    <GameLayout>
      {/* <ChallengeSection
        enableSyntaxHighlighting={enableSyntaxHighlighting}
        setEnableSyntaxHighlighting={setEnableSyntaxHighlighting}
      /> */}
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
      {showWinMessage && fullDailySnippet && snippetLanguage && (
        <WinMessage language={snippetLanguage} snippet={fullDailySnippet} />
      )}
      {snippetCode && (
        <SnippetDisplay
          snippet={{ code: snippetCode }}
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