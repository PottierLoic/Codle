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
  const { solutions, refetch } = useRegexSolutions();

  const [regexPattern, setRegexPattern] = useState("");
  const [replacement, setReplacement] = useState("");
  const [debouncedPattern, setDebouncedPattern] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

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

  if (loading) return <GameLayout><p>Loading...</p></GameLayout>;
  if (!dailyRegex) return <GameLayout><p>No regex challenge found for today.</p></GameLayout>;

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
      return [<span key="error">Invalid regex pattern</span>];
    }

    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(dailyRegex.source_text)) !== null) {
      const index = match.index;

      if (index > lastIndex) {
        result.push(
          <span key={key++}>{dailyRegex.source_text.slice(lastIndex, index)}</span>
        );
      }

      if (replacement === "") {
        result.push(
          <span
            key={key++}
            className="bg-red-600 text-white px-1 rounded-sm line-through"
          >
            {match[0]}
          </span>
        );
      } else {
        const replacementText = replacement.replace(/\$(\d+)/g, (_, g) => match?.[+g] ?? "");
        result.push(
          <span
            key={key++}
            className="bg-green-600 text-black px-1 rounded-sm"
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
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Find a regex to follow the instruction</h1>
        <p className="text-left w-full">{dailyRegex.instruction}</p>

        {!submitted ? (
          <>
            <form className="w-full mt-4 space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-500 focus:outline-none focus:border-blue-400"
                placeholder="Enter your regex pattern"
              />
              <input
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-500 focus:outline-none focus:border-blue-400"
                placeholder="Enter replacement (optional)"
              />
            </form>
            <button
              onClick={handleSubmit}
              disabled={!isCorrect || submitting}
              className={`mt-6 px-4 py-2 rounded-md font-semibold ${
                isCorrect
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Solution"}
            </button>
          </>
        ) : (
          <div className="mt-6 w-full text-center">
            <p className="text-2xl font-semibold text-green-400 mb-2">🎉 Correct! You&apos;ve solved the challenge.</p>
            <pre className="mt-2 bg-gray-800 text-white text-sm p-3 rounded-md border border-gray-600">
              <p>{`${regexPattern}`}</p>
              <p>{`${replacement || "(empty)"}`}</p>
            </pre>
            <button
              onClick={() => setShowSolutions(true)}
              className="mt-4 text-blue-400 hover:underline"
            >
              See other solutions
            </button>
          </div>
        )}

        <div className="w-full mt-6">
          <h2 className="text-xl font-semibold mb-2 text-center">Live Preview</h2>
          <pre className="bg-gray-700 p-4 rounded-md border border-gray-500 whitespace-pre-wrap break-words text-sm text-white">
            {getHighlightedText()}
          </pre>
        </div>
      </div>

      {showSolutions && (
        <div className="fixed top-0 left-0 w-full h-full z-50 backdrop-blur-md bg-black/70 animate-fade-in">
          <div className="max-w-3xl mx-auto mt-10 bg-gray-900 p-6 rounded-md shadow-lg relative border border-gray-700">
            <button
              className="absolute top-3 right-3 text-white hover:text-red-400"
              onClick={() => setShowSolutions(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">All solutions submitted</h2>
            {solutions.length === 0 ? (
              <p className="text-center text-gray-300">No solutions available.</p>
            ) : (
              <ul className="space-y-3 text-white">
                {solutions.map((s, i) => {
                  const { pattern, replacement: replace } = s;
                  return (
                    <li
                      key={s.id}
                      className={`p-3 border rounded-md ${
                        i === 0 ? "border-blue-500 bg-blue-900" : "border-gray-600 bg-gray-800"
                      }`}
                    >
                      <p><span className="font-bold">Pattern:</span> <code>{pattern}</code></p>
                      <p><span className="font-bold">Replacement:</span> <code>{replace || "(empty)"}</code></p>
                      {i === 0 && <p className="text-xs text-blue-300 mt-1">Official Solution</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </GameLayout>
  );
}
