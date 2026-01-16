"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/common/layout/GameLayout";
import useDailyRegex from "@/hooks/regex/useDailyRegex";
import useSubmitRegexSolution from "@/hooks/regex/useSubmitRegexSolution";
import useRegexSolutions from "@/hooks/regex/useRegexSolutions";
import { loadProgress, saveProgress } from "@/lib/saveProgress";
import { getTodayDateString } from "@/lib/utils";
import { STORAGE_KEYS } from "@/constants";
import React from "react";
import { X } from "lucide-react";

export default function RegexGame() {
  const { dailyRegex, loading } = useDailyRegex();
  const { submitSolution, submitting } = useSubmitRegexSolution();

  const [regexPattern, setRegexPattern] = useState("");
  const [replacement, setReplacement] = useState("");

  const [debouncedPattern, setDebouncedPattern] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const { solutions, refetch } = useRegexSolutions({ enabled: submitted });

  const dayString = getTodayDateString();

  useEffect(() => {
    if (!dailyRegex) return;
    const saved = loadProgress<{ pattern: string; replacement: string }>(
      STORAGE_KEYS.REGEX_SOLUTION,
      dayString
    );
    if (saved) {
      setRegexPattern(saved.pattern);
      setReplacement(saved.replacement);
      setSubmitted(true);
    }
  }, [dailyRegex, dayString]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedPattern(regexPattern);
    }, 200);
    return () => clearTimeout(timeout);
  }, [regexPattern]);

  if (loading) {
    return (
      <GameLayout>
        <div className="w-full max-w-2xl glass p-5 sm:p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/60 mx-auto mb-3" />
          <p className="font-semibold">Loading…</p>
          <p className="text-sm muted mt-1">Fetching today&apos;s regex challenge</p>
        </div>
      </GameLayout>
    );
  }

  if (!dailyRegex) {
    return (
      <GameLayout>
        <div className="w-full max-w-2xl glass p-5 sm:p-6 text-center">
          <p className="font-semibold">No regex challenge found for today.</p>
          <p className="text-sm muted mt-1">Please try again later.</p>
        </div>
      </GameLayout>
    );
  }

  const getModifiedText = () => {
    try {
      const regex = new RegExp(debouncedPattern, "g");
      return dailyRegex.source_text.replace(regex, (match, ...groups) => {
        return replacement.replace(/\$(\d+)/g, (_, g) => groups[+g - 1] ?? "");
      });
    } catch {
      return "";
    }
  };

  const modifiedText = getModifiedText();
  const isCorrect = modifiedText === dailyRegex.target_text;

  const getHighlightedText = () => {
    if (!debouncedPattern) {
      return [<span key="original">{dailyRegex.source_text}</span>];
    }

    let regex: RegExp;
    try {
      regex = new RegExp(debouncedPattern, "g");
    } catch {
      return [
        <span key="error" className="text-red-300">
          Invalid regex pattern
        </span>,
      ];
    }

    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(dailyRegex.source_text)) !== null) {
      const index = match.index;

      if (index > lastIndex) {
        result.push(
          <span key={key++}>
            {dailyRegex.source_text.slice(lastIndex, index)}
          </span>
        );
      }

      if (replacement === "") {
        result.push(
          <span
            key={key++}
            className="bg-red-500/30 text-white px-1 rounded-sm line-through border border-white/10"
          >
            {match[0]}
          </span>
        );
      } else {
        const replacementText = replacement.replace(/\$(\d+)/g, (_, g) => match?.[+g] ?? "");
        result.push(
          <span
            key={key++}
            className="bg-green-500/25 text-white px-1 rounded-sm border border-white/10"
          >
            {replacementText}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }

    if (lastIndex < dailyRegex.source_text.length) {
      result.push(
        <span key={key++}>{dailyRegex.source_text.slice(lastIndex)}</span>
      );
    }

    return result;
  };

  const handleSubmit = async () => {
    if (!isCorrect || submitting) return;

    await submitSolution({
      regexId: dailyRegex.id,
      pattern: regexPattern,
      replacement,
    });

    saveProgress(STORAGE_KEYS.REGEX_SOLUTION, dayString, {
      pattern: regexPattern,
      replacement,
    });

    setSubmitted(true);
    await refetch();
  };

  return (
    <GameLayout>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-4">
        <div className="w-full glass p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
            Regex Challenge
          </h1>
          <p className="text-sm sm:text-base muted text-center">
            Find a regex (and optional replacement) that follows the instruction.
          </p>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm sm:text-base whitespace-pre-wrap">
              {dailyRegex.instruction}
            </p>
          </div>
        </div>

        {!submitted ? (
          <div className="w-full glass p-5 sm:p-6">
            <form
              className="w-full space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="pattern">
                  Pattern
                </label>
                <input
                  id="pattern"
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm sm:text-base focus-ring transition placeholder:text-white/40 font-mono"
                  placeholder="Enter your regex pattern"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="replacement">
                  Replacement (optional)
                </label>
                <input
                  id="replacement"
                  type="text"
                  value={replacement}
                  onChange={(e) => setReplacement(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm sm:text-base focus-ring transition placeholder:text-white/40 font-mono"
                  placeholder="Enter replacement (optional)"
                />
              </div>
            </form>

            <button
              onClick={handleSubmit}
              disabled={!isCorrect || submitting}
              className={`mt-4 btn btn-primary focus-ring w-full px-4 py-2 text-sm sm:text-base ${
                !isCorrect || submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit Solution"}
            </button>

            <p className="mt-2 text-xs muted text-center">
              {isCorrect ? "Matches target — ready to submit." : "Not matching yet."}
            </p>
          </div>
        ) : (
          <div className="w-full glass p-5 sm:p-6 text-center">
            <p className="text-lg sm:text-xl font-semibold text-green-200 mb-2">
              Solved.
            </p>

            <pre className="mt-3 rounded-xl border border-white/10 bg-black/30 text-left text-sm p-4 font-mono overflow-auto">
              <p>{regexPattern}</p>
              <p>{replacement || "(empty)"}</p>
            </pre>

            <button
              onClick={() => setShowSolutions(true)}
              className="mt-4 btn focus-ring px-4 py-2 text-sm sm:text-base"
            >
              See other solutions
            </button>
          </div>
        )}

        <div className="w-full glass p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-center">
            Live Preview
          </h2>
          <pre className="rounded-xl border border-white/10 bg-black/30 p-4 whitespace-pre-wrap break-words text-sm sm:text-base text-white font-mono leading-relaxed overflow-auto">
            {getHighlightedText()}
          </pre>
        </div>
      </div>

      {showSolutions && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md">
          <div className="app-container">
            <div className="max-w-3xl mx-auto mt-10 glass glass-strong p-6 rounded-md shadow-lg relative">
              <button
                className="absolute top-3 right-3 btn showSolutions focus-ring px-3 py-2"
                onClick={() => setShowSolutions(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                All solutions submitted
              </h2>

              {solutions.length === 0 ? (
                <p className="text-center muted">No solutions available.</p>
              ) : (
                <ul className="space-y-3">
                  {solutions.map((s, i) => {
                    const { pattern, replacement: replace } = s;
                    return (
                      <li
                        key={s.id}
                        className={`p-4 rounded-xl border ${
                          i === 0
                            ? "border-white/20 bg-white/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <p className="text-sm">
                          <span className="font-semibold">Pattern:</span>{" "}
                          <code className="font-mono">{pattern}</code>
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Replacement:</span>{" "}
                          <code className="font-mono">{replace || "(empty)"}</code>
                        </p>
                        {i === 0 && (
                          <p className="text-xs muted mt-2">Official Solution</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
