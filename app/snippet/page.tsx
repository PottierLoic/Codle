"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import useSnippets from "@/hooks/useSnippets";
import useGuessCounts from "../../hooks/useGuessCountsSnippet";
import useDailySnippet from "@/hooks/useDailySnippet";
import { Language } from "../../hooks/useLanguages";

export default function SnippetGame() {
  const { snippets, loading } = useSnippets();
  const { incrementGuessCount } = useGuessCounts();

  const { dailySnippet: todaySnippet } = useDailySnippet();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const { dailySnippet: yesterdaySnippet } = useDailySnippet(yesterdayDate);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]); // maybe not this type
  const [suggestions, setSuggestions] = useState<Language[]>([]); // maybe not this type
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dayString = new Date().toISOString().slice(0, 10);

  const hasWon = guesses.some((g) => g.nameMatch);
  const [showWinMessage, setShowWinMessage] = useState(false);

  return (
     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center p-4">

          </main>
          <Footer />
        </div>
  )
}