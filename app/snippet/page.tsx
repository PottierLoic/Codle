"use client";

import { useState, useEffect, useCallback } from "react";
import { getTodayString, getYesterdayString } from "@/lib/utils";
import GameLayout from "@/components/common/layout/GameLayout";
import WinMessage from "@/components/common/ui/WinMessage";
import { STORAGE_KEYS } from "@/constants";
import useLanguages from "@/hooks/language/useLanguages";
import useGuessCounts from "@/hooks/snippet/useGuessCountsSnippet";
import useDailySnippet from "@/hooks/snippet/useDailySnippet";
import { Language } from "@/entities/Language";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import { compareGuess } from "@/lib/snippetLogic";
import { SnippetGuessResult } from "@/entities/Snippet";
import GuessForm from "@/components/forms/GuessForm";
import SnippetGameGrid from "@/components/snippet/SnippetGameGrid";
import SnippetDisplay from "@/components/snippet/SnippetDisplay";
import ChallengeSection from "@/components/snippet/ChallengeSection";
import LoadingScreen from "@/components/common/feedback/LoadingScreen";

export default function SnippetGame() {
  const { languages, loading: languagesLoading } = useLanguages();
  const { incrementGuessCount } = useGuessCounts();

  const { dailySnippet: todaySnippet } = useDailySnippet();
  const [yesterdayDate] = useState(() => new Date(getYesterdayString()));
  const { dailySnippet: yesterdaySnippet } = useDailySnippet(yesterdayDate);

  const [snippetLanguage, setSnippetLanguage] = useState<Language | null>(null);
  const [yesterdaySnippetLanguage, setYesterdaySnippetLanguage] = useState<Language | null>(null);

  const [enableSyntaxHighlighting, setEnableSyntaxHighlighting] = useState(false);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<SnippetGuessResult[]>([]);
  const [suggestions, setSuggestions] = useState<Language[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = getTodayString();

  const hasWon = guesses.some((g) => g.languageMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

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
      const foundLanguage = languages.find(lang => lang.id === todaySnippet.language_id);
      setSnippetLanguage(foundLanguage || null);
    }
  }, [todaySnippet, languages]);

  useEffect(() => {
    if (yesterdaySnippet && languages.length > 0) {
      const foundLanguage = languages.find(lang => lang.id === yesterdaySnippet.language_id);
      setYesterdaySnippetLanguage(foundLanguage || null);
    }
  }, [yesterdaySnippet, languages]);

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
      {showWinMessage && snippetLanguage && todaySnippet && (
        <WinMessage language={snippetLanguage} snippet={todaySnippet} />
      )}
      {todaySnippet && (
        <SnippetDisplay
          snippet={todaySnippet}
          syntaxName={snippetLanguage?.syntax_name}
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