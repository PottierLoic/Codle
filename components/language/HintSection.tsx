import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUESS_THRESHOLDS } from "@/constants";
import { Snippet } from "@/entities/Snippet";
import SnippetDisplay from "@/components/snippet/SnippetDisplay";

interface HintSectionProps {
  incorrectGuesses: number;
  letters: number;
  creators: string[];
  code: string;
}

export default function HintSection({ incorrectGuesses, letters, creators, code }: HintSectionProps) {
  const [revealedHintIndex, setRevealedHintIndex] = useState<number | null>(null);

  const hints = [
    `This language name has ${letters} letters.`,
    `This language was created by ${creators.join(", ")}.`,
    code,
  ];
  const hintLabels = ["Letters", "Creator(s)", "Snippet"];

  const handleHintClick = (index: number) => {
    if (incorrectGuesses >= GUESS_THRESHOLDS[index]) {
      setRevealedHintIndex((prev) => (prev === index ? null : index));
    }
  };

  const nextUnlock = GUESS_THRESHOLDS.find((threshold) => incorrectGuesses < threshold);
  const guessesRemaining = nextUnlock ? nextUnlock - incorrectGuesses : 0;

  return (
    <div className="m-3 w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-white mb-3">Hints</h3>

      <div className="flex justify-center gap-4 mb-3">
        {hintLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleHintClick(index)}
            disabled={incorrectGuesses < GUESS_THRESHOLDS[index]}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              incorrectGuesses >= GUESS_THRESHOLDS[index]
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            } ${revealedHintIndex === index ? "ring-2 ring-blue-300" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {revealedHintIndex !== null && (
          <motion.div
            key={revealedHintIndex}
            className="mt-2 rounded-md text-white whitespace-pre-line"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {revealedHintIndex === 2 ? (
              <SnippetDisplay
                snippet={{ code: hints[2] } as Snippet}
                syntaxName="todo"
                enableSyntaxHighlighting={false}
              />
            ) : (
              hints[revealedHintIndex]
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 text-sm text-gray-400">
        {nextUnlock
          ? `${guessesRemaining} more incorrect guess${guessesRemaining > 1 ? "es" : ""} needed to unlock the next hint.`
          : "All hints are unlocked!"}
      </p>
    </div>
  );
}
