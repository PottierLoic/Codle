import { motion } from "framer-motion";
import { useState } from "react";
import { LanguageGuessResult } from "@/entities/Language";
import Image from "next/image";
import { easeOut } from "framer-motion";

interface LanguageGameGridProps {
  guesses: LanguageGuessResult[];
}

export default function LanguageGameGrid({ guesses }: LanguageGameGridProps) {
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const revealVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.5, duration: 0.5, ease: easeOut },
    }),
  };

  const columns = [
    { label: "Name", tooltip: "Name of the language" },
    { label: "Paradigms", tooltip: "Main programming paradigms" },
    { label: "Year", tooltip: "Initial release/birth year" },
    { label: "Typing", tooltip: "Typing discipline (Dynamic, Static)" },
    {
      label: "Execution",
      tooltip: "Execution model (Compiled, Interpreted, Hybrid)",
    },
    { label: "GC", tooltip: "Whether the language uses garbage collection" },
    {
      label: "Scope",
      tooltip:
        "Domains in which the language is used (Mathematics, AI, ...)",
    },
    { label: "Symbol", tooltip: "Key character or token used in the language" },
  ];

  return (
    <div className="w-full max-w-5xl glass p-3 sm:p-4">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-1 text-center font-semibold text-white/80 bg-white/5 p-2 rounded-t-xl border border-white/10">
            {columns.map((col) => (
              <div
                key={col.label}
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHoveredCol(col.label)}
                onMouseLeave={() => setHoveredCol(null)}
                onMouseMove={(e) =>
                  setTooltipPos({ x: e.clientX, y: e.clientY })
                }
              >
                <span>{col.label}</span>
              </div>
            ))}
          </div>

          {[...guesses].reverse().map((g) => (
            <div
              key={g.id}
              className="grid grid-cols-8 gap-1 text-center text-white bg-white/5 p-1 rounded-xl mb-2 border border-white/10"
            >
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
                  match: g.yearMatch,
                },
                { value: g.typing, match: g.typingMatch },
                { value: g.execution, match: g.executionMatch },
                { value: g.gc ? "Yes" : "No", match: g.gcMatch },
                { value: g.scope.join(", "), match: g.scopeMatch },
                { value: g.symbol, match: g.symbolMatch },
              ].map((item, colIndex) => (
                <motion.div
                  key={colIndex}
                  className={`p-2 border border-black/20 rounded-lg flex items-center justify-center gap-2 ${
                    colIndex === 0
                      ? "relative bg-white/6 text-white min-h-[96px]"
                      : item.match === true || item.match === "full"
                      ? "bg-green-600/35 text-white border border-white/10"
                      : item.match === "partial"
                      ? "bg-amber-500/30 text-white border border-white/10"
                      : "bg-red-500/30 text-white border border-white/10"
                  }`}
                  variants={revealVariants}
                  initial={g.isFromStorage ? "visible" : "hidden"}
                  animate="visible"
                  custom={colIndex}
                >
                  {colIndex === 0 && item.icon ? (
                    <div className="relative w-[64px] h-[64px] flex items-center justify-center">
                      <div className="absolute top-0 left-0 right-0 bg-black/40 text-xs text-center py-1 truncate">
                        {item.value}
                      </div>
                      <Image
                        src={item.icon}
                        alt={g.name}
                        width={64}
                        height={64}
                        className="rounded-md object-contain w-full h-full"
                      />
                      <span className="absolute bottom-1 right-1 border border-white/10 bg-black/40 text-xs px-1 py-0.5 rounded">
                        {g.guessCount ?? 0}
                      </span>
                    </div>
                  ) : (
                    item.value
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {hoveredCol && (
        <div
          className="pointer-events-none fixed glass px-2 py-1 text-xs whitespace-nowrap z-50"
          style={{
            top: tooltipPos.y + 10,
            left: tooltipPos.x + 10,
          }}
        >
          {columns.find((c) => c.label === hoveredCol)?.tooltip}
        </div>
      )}
    </div>
  );
}
