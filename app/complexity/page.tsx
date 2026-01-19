"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/common/layout/GameLayout";
import LoadingScreen from "@/components/common/feedback/LoadingScreen";
import useDailyComplexity from "@/hooks/complexity/useDailyComplexity";
import useFullDailyComplexity from "@/hooks/complexity/useFullDailyComplexity";
import { getTodayDateString } from "@/lib/utils";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import type { ComplexityGuessResult } from "@/entities/Complexity";

type ComplexityOption =
  | "O(1)"
  | "O(log n)"
  | "O(n)"
  | "O(n log n)"
  | "O(n²)"
  | "O(2^n)";

const COMPLEXITY_OPTIONS: ComplexityOption[] = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n²)",
  "O(2^n)",
];

type StoredState = {
  attempts: number;
  disabledOptions: ComplexityOption[];
  hasWon: boolean;
};

const STORAGE_KEY = "complexity-state";

async function postGuess(guessedComplexity: string): Promise<ComplexityGuessResult> {
  const res = await fetch("/api/guessComplexity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guessedComplexity }),
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.message ?? "Failed to submit guess");
  }

  return res.json();
}

export default function ComplexityGame() {
  const dayString = getTodayDateString();
  const dateKey = useMemo(() => new Date(dayString), [dayString]);

  const { dailyComplexity, loading } = useDailyComplexity({
    date: dateKey,
    enabled: true,
  });

  const [attempts, setAttempts] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState<ComplexityOption[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { fullDailyComplexity } = useFullDailyComplexity({
    date: dateKey,
    enabled: hasWon,
  });

  useEffect(() => {
    const stored = loadProgress<StoredState>(STORAGE_KEY, dayString);
    if (stored) {
      setAttempts(stored.attempts);
      setDisabledOptions(stored.disabledOptions);
      setHasWon(stored.hasWon);
    }
  }, [dayString]);

  useEffect(() => {
    saveProgress<StoredState>(STORAGE_KEY, dayString, {
      attempts,
      disabledOptions,
      hasWon,
    });
  }, [attempts, disabledOptions, hasWon, dayString]);

  const handlePick = useCallback(
    async (option: ComplexityOption) => {
      if (!dailyComplexity) return;
      if (hasWon) return;
      if (submitting) return;
      if (disabledOptions.includes(option)) return;

      setFeedback(null);
      setSubmitting(true);

      try {
        const result = await postGuess(option);

        setAttempts((a) => a + 1);

        if (result.correct) {
          setHasWon(true);
          setFeedback("Correct!");
          return;
        }

        setDisabledOptions((prev) => [...prev, option]);

        if (result.trend === "higher") {
          setFeedback("Too slow (your guess grows faster than the real one).");
        } else if (result.trend === "lower") {
          setFeedback("Too fast (your guess grows slower than the real one).");
        } else {
          setFeedback("Wrong complexity.");
        }
      } catch (err) {
        console.error("[ERROR] postGuess failed:", err);
        setFeedback("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [dailyComplexity, hasWon, submitting, disabledOptions]
  );

  if (loading) return <LoadingScreen />;

  if (!dailyComplexity) {
    return (
      <GameLayout>
        <div className="w-full max-w-2xl glass p-5 sm:p-6 text-center">
          <p className="font-semibold">No complexity challenge found for today.</p>
          <p className="text-sm muted mt-1">Please try again later.</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <div className="glass p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            Complexity
          </h1>
          <p className="mt-2 text-sm sm:text-base muted text-center">
            Guess the time complexity of today&apos;s {dailyComplexity.language} snippet. Wrong answers get disabled.
          </p>
        </div>

        <div className="glass p-5 sm:p-6">
          <pre className="rounded-xl border border-white/10 bg-black/30 p-4 whitespace-pre-wrap break-words text-sm sm:text-base text-white font-mono leading-relaxed overflow-auto">
            {dailyComplexity.snippet}
          </pre>
        </div>

        <div className="glass p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm muted">
              Attempts: <span className="text-white/90 font-semibold">{attempts}</span>
            </p>
            <span
              className={`text-xs rounded-full px-2 py-1 border ${
                hasWon
                  ? "border-green-500/30 bg-green-500/15 text-green-200"
                  : "border-white/10 bg-white/5 text-white/70"
              }`}
            >
              {hasWon ? "Solved" : "Unsolved"}
            </span>
          </div>

          {feedback && <p className="mt-3 text-sm text-center muted">{feedback}</p>}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COMPLEXITY_OPTIONS.map((opt) => {
              const disabled = hasWon || submitting || disabledOptions.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handlePick(opt)}
                  disabled={disabled}
                  className={`btn focus-ring px-3 py-2 text-sm sm:text-base font-mono ${
                    disabled ? "opacity-45 cursor-not-allowed" : "hover:bg-white/10"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {hasWon && fullDailyComplexity && (
          <div className="glass p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Correct!</h2>
            <p className="text-sm sm:text-base">
              The correct complexity is{" "}
              <span className="font-mono font-semibold">{fullDailyComplexity.solution}</span>.
            </p>

            {fullDailyComplexity.explanation && (
              <p className="mt-2 text-sm muted whitespace-pre-wrap">
                {fullDailyComplexity.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </GameLayout>
  );
}
