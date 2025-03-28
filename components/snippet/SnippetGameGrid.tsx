import { motion } from "framer-motion";
import Image from "next/image";
import { SnippetGuessResult } from "@/entities/Snippet";
import useGuessCounts from "@/hooks/useGuessCountsSnippet";

interface SnippetGameGridProps {
  guesses: SnippetGuessResult[];
}

export default function SnippetGameGrid({ guesses }: SnippetGameGridProps) {
  const { guessCounts } = useGuessCounts();

  const revealVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.5, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="w-full max-w-md bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <div className="text-center font-semibold text-gray-300 bg-gray-800 p-2 rounded-t-lg">
        Language Guesses
      </div>

      {[...guesses].reverse().map((g, index) => (
        <motion.div
          key={g.id}
          className={`relative flex items-center justify-center p-2 border border-black rounded ${
            g.languageMatch ? "bg-green-800" : "bg-red-800"
          }`}
          variants={revealVariants}
          initial={g.isFromStorage ? "visible" : "hidden"}
          animate="visible"
          custom={index}
        >
          <div className="relative w-[96px] h-[96px] flex items-center justify-center">
            <div className="absolute top-0 inset-x-0 bg-gray-900/80 text-xs text-center py-1 z-10">
              {g.language}
            </div>
            {g.icon ? (
              <Image
                src={g.icon}
                alt={g.language}
                width={96}
                height={96}
                className="rounded-md object-contain w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-md">
                <span className="text-white text-lg">{g.language}</span>
              </div>
            )}
            <span className="absolute bottom-1 right-1 border border-gray-500 bg-gray-800 text-xs px-2 py-1 rounded">
              {guessCounts[g.language] ?? 0}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
