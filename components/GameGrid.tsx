import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GuessResult } from "../lib/gameLogic";
import Image from "next/image";
import useGuessCounts from "../hooks/useGuessCountsLang";

interface GameGridProps {
  guesses: GuessResult[];
  maxGuesses: number;
}

export default function GameGrid({ guesses }: GameGridProps) {
  const [showWinMessage, setShowWinMessage] = useState(false);
  const { guessCounts } = useGuessCounts();
  const hasWon = guesses.some((g) => g.nameMatch);

  const [hoveredCol, setHoveredCol] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

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
      transition: { delay: i * 0.5, duration: 0.5, ease: "easeOut" },
    }),
  };

  const columns = [
    { label: "Name", tooltip: "Name of the language" },
    { label: "Paradigms", tooltip: "Main programming paradigms" },
    { label: "Year", tooltip: "Initial release/birth year" },
    { label: "Typing", tooltip: "Typing discipline (Dynamic, Static)" },
    { label: "Execution", tooltip: "Execution model (Compiled, Interpreted, Hybrid)" },
    { label: "GC", tooltip: "Whether the language uses garbage collection" },
    { label: "Scope", tooltip: "Domains in which the language is used (Mathematics, AI, ...)" },
    { label: "Symbol", tooltip: "Key character or token used in the language" }
  ]

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
        {columns.map((col) => (
          <div
            key={col.label}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredCol(col.label)}
            onMouseLeave={() => setHoveredCol(null)}
            onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
          >
            <span>{col.label}</span>
          </div>
        ))}
      </div>

      {hoveredCol && (
        <div
          className="pointer-events-none fixed bg-gray-700 text-white rounded px-2 py-1 text-xs whitespace-nowrap z-50"
          style={{
            top: tooltipPos.y + 10,
            left: tooltipPos.x + 10
          }}
        >
          {columns.find((c) => c.label === hoveredCol)?.tooltip}
        </div>
      )}

      {guesses.map((g, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-8 gap-1 text-center text-white bg-gray-700 p-1 rounded-md">
          {[
            { value: g.name, match: g.nameMatch, icon: g.icon },
            { value: g.paradigms.join(", "), match: g.paradigmsMatch },
            {
              value: (
                <div className="flex items-center justify-center gap-1">
                  <span>{g.year}</span>
                  {g.yearMatch === "higher" && <span>▲</span>}
                  {g.yearMatch === "lower" && <span>▼</span>}
                </div>
              ),
              match: g.yearMatch
            },
            { value: g.typing, match: g.typingMatch },
            { value: g.execution, match: g.executionMatch },
            { value: g.gc ? "✅" : "❌", match: g.gcMatch },
            { value: g.scope.join(", "), match: g.scopeMatch },
            { value: g.symbol, match: g.symbolMatch },
          ].map((item, colIndex) => (
            <motion.div
              key={colIndex}
              className={`p-2 border border-black rounded flex items-center justify-center gap-2 ${
                colIndex === 0
                  ? "relative bg-gray-800 text-white"
                  : item.match === true || item.match === "full"
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
              {colIndex === 0 ? (
                <>
                  {item.icon && (
                    <Image src={item.icon} alt={g.name} width={48} height={48} className="rounded-md"/>
                  )}
                  <span className="absolute bottom-1 right-1 text-xs text-white-400 px-2 py-1 rounded">
                    {guessCounts[g.name] ?? 0}
                  </span>
                </>
              ) : (
                item.value
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}