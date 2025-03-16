import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Language } from "@/hooks/useLanguages";
import { GuessResult } from "../lib/gameLogic";
import Image from "next/image";

interface GameGridProps {
  guesses: GuessResult[];
  maxGuesses: number;
}

export default function GameGrid({ guesses }: GameGridProps) {
  const [showWinMessage, setShowWinMessage] = useState(false);
  const hasWon = guesses.some((g) => g.nameMatch);

  useEffect(() => {
    if (hasWon) {
      setTimeout(() => setShowWinMessage(true), 3500);
    }
  }, [hasWon, guesses.length]);

  const revealVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {delay: i * 0.5, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="w-full max-w-5xl bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {showWinMessage && (
        <p className="text-2xl text-green-400 font-semibold mb-4 text-center">
          You won! 🎉
        </p>
      )}

      {!showWinMessage && guesses.length > 0 && (
        <p className="text-lg text-gray-400 mb-4 text-center">
          Keep guessing!
        </p>
      )}

      <div className="grid grid-cols-8 gap-1 text-center font-semibold text-gray-300 bg-gray-800 p-2 rounded-t-lg">
        <div className="flex items-center justify-center">Name</div>
        <div className="flex items-center justify-center">Paradigms</div>
        <div className="flex items-center justify-center">Year</div>
        <div className="flex items-center justify-center">Typing</div>
        <div className="flex items-center justify-center">Execution</div>
        <div className="flex items-center justify-center">GC</div>
        <div className="flex items-center justify-center">Scope</div>
        <div className="flex items-center justify-center">Symbol</div>
      </div>

      {guesses.map((g, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-8 gap-1 text-center text-white bg-gray-700 p-1 rounded-md">
          {[
            { value: g.name, match: g.nameMatch, icon: g.icon },
            { value: g.paradigms.join(", "), match: g.paradigmsMatch },
            { value: g.year, match: g.yearMatch },
            { value: g.typing, match: g.typingMatch },
            { value: g.execution, match: g.executionMatch },
            { value: g.gc ? "✅" : "❌", match: g.gcMatch },
            { value: g.scope.join(", "), match: g.scopeMatch },
            { value: g.symbol, match: g.symbolMatch },
          ].map((item, colIndex) => (
            <motion.div
              key={colIndex}
              className={`p-2 border border-black rounded flex items-center justify-center gap-2 ${
                item.match === true || item.match === "full"
                  ? "bg-green-800 text-white"
                  : item.match === "partial"
                  ? "bg-yellow-800 text-white"
                  : "bg-red-800 text-white"
              }`}
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              custom={colIndex}
            >
              {item.icon && <Image src={item.icon} alt={g.name} width={48} height={48} className="rounded-md" />}
              {colIndex !== 0 && item.value}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}