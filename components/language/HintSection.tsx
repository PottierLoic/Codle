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

export default function HintSection({
  incorrectGuesses,
  letters,
  creators,
  code,
}: HintSectionProps) {
  const [revealedHintIndex, setRevealedHintIndex] = useState<number | null>(
    null
  );

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

  const nextUnlock = GUESS_THRESHOLDS.find(
    (threshold) => incorrectGuesses < threshold
  );
  const guessesRemaining = nextUnlock ? nextUnlock - incorrectGuesses : 0;

  return (
    <div className="m-3 w-full max-w-lg glass p-4 sm:p-5 text-center">
      <h3 className="text-base sm:text-lg font-semibold mb-3">Hints</h3>

      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {hintLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleHintClick(index)}
            disabled={incorrectGuesses < GUESS_THRESHOLDS[index]}
            className={`btn focus-ring px-3 py-2 text-sm font-semibold transition-all ${
              incorrectGuesses >= GUESS_THRESHOLDS[index]
                ? "hover:bg-white/10"
                : "opacity-40 cursor-not-allowed"
            } ${revealedHintIndex === index ? "border-white/20 bg-white/10" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {revealedHintIndex !== null && (
          <motion.div
            key={revealedHintIndex}
            className="mt-2 rounded-md whitespace-pre-line"
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
      <p className="mt-4 text-sm muted">
        {nextUnlock
          ? `${guessesRemaining} more incorrect guess${
              guessesRemaining > 1 ? "es" : ""
            } needed to unlock the next hint.`
          : "All hints are unlocked!"}
      </p>
    </div>
  );
}
