import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HintSectionProps {
  incorrectGuesses: number;
  letters: number;
  creators: string[];
  snippet: string;
}

export default function HintSection({ incorrectGuesses, letters, creators, snippet }: HintSectionProps) {
  const [revealedHintIndex, setRevealedHintIndex] = useState<number | null>(null);
  const unlockThresholds = [3, 6, 9];

  const hints = [
    `This language name has ${letters} letters.`,
    `This language was created by ${creators.join(", ")}.`,
    `Example snippet:\n\n${snippet}`,
  ];
  const hintLabels = ["Letters", "Creator(s)", "Snippet"];

  const handleHintClick = (index: number) => {
    if (incorrectGuesses >= unlockThresholds[index]) {
      setRevealedHintIndex((prev) => (prev === index ? null : index));
    }
  };

  return (
    <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-white mb-3">Hints</h3>

      <div className="flex justify-center gap-4 mb-3">
        {hintLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleHintClick(index)}
            disabled={incorrectGuesses < unlockThresholds[index]}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              incorrectGuesses >= unlockThresholds[index]
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
            className="mt-2 bg-gray-700 p-3 rounded-md text-white whitespace-pre-line"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {hints[revealedHintIndex]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
