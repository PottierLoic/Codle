"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/common/layout/GameLayout";
import useDailyRegex from "@/hooks/useDailyRegex";

export default function RegexGame() {
  const { dailyRegex, loading } = useDailyRegex();
  const [regexPattern, setRegexPattern] = useState("");
  const [replacement, setReplacement] = useState("");
  const [debouncedPattern, setDebouncedPattern] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedPattern(regexPattern);
    }, 200);
    return () => clearTimeout(timeout);
  }, [regexPattern]);

  if (loading) return <GameLayout><p>Loading...</p></GameLayout>;
  if (!dailyRegex) return <GameLayout><p>No regex challenge found for today.</p></GameLayout>;

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

  return (
    <GameLayout>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Find a regex to follow the instruction</h1>
        <p className="text-left w-full">{dailyRegex.instruction}</p>

        <form className="w-full mt-4 space-y-2">
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

        <div className="w-full mt-6">
          <h2 className="text-xl font-semibold mb-2 text-center">Live Preview</h2>
          <pre className="bg-gray-700 p-4 rounded-md border border-gray-500 whitespace-pre-wrap break-words text-sm text-white">
            {getHighlightedText()}
          </pre>
        </div>
      </div>
    </GameLayout>
  );
}
