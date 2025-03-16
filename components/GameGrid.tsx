import { Language, GuessResult } from "../lib/gameLogic";

interface GameGridProps {
  guesses: GuessResult[];
  maxGuesses: number;
  targetLanguage: Language | null;
}

export default function GameGrid({ guesses, targetLanguage }: GameGridProps) {
  const hasWon = guesses.some((g) => g.nameMatch);

  return (
    <div className="w-full max-w-5xl bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {hasWon && (
        <p className="text-2xl text-green-400 font-semibold mb-4 text-center">You won! 🎉</p>
      )}
      {!hasWon && guesses.length > 0 && (
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
      {guesses.map((g, index) => (
        <div key={index} className="grid grid-cols-8 gap-1 text-center text-white bg-gray-700 p-1 rounded-md">
          <div className={`p-2 border border-black rounded font-medium flex items-center justify-center ${
              g.nameMatch ? "bg-green-700 text-white" : "bg-red-800 text-white text-white"
            }`}>
            <img src={g.icon} alt={g.name} className="w-12 h-12 rounded-md" />
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.paradigmsMatch === "full"
                ? "bg-green-800 text-white"
                : g.paradigmsMatch === "partial"
                ? "bg-yellow-800 text-white"
                : "bg-red-800 text-white"
            }`}>
            {g.paradigms.join(", ")}
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.yearMatch === "full"
                ? "bg-green-800 text-white"
                : "bg-red-800 text-white"
            }`}>
            {g.year} {targetLanguage ? (g.year < targetLanguage.year ? "^" : g.year > targetLanguage.year ? "v" : "") : ""}
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.typingMatch ? "bg-green-800 text-white" : "bg-red-800 text-white"
            }`}>
            {g.typing}
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.executionMatch ? "bg-green-800 text-white" : "bg-red-800 text-white"
            }`}>
            {g.execution}
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.gc ? "bg-green-800 text-white" : "bg-red-800 text-white"
            }`}>
            {g.gc ? "Yes" : "No"}
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.scopeMatch === "full"
                ? "bg-green-800 text-white"
                : g.scopeMatch === "partial"
                ? "bg-yellow-800 text-white"
                : "bg-red-800 text-white"
            }`}>
            {g.scope.join(", ")}
          </div>
          <div className={`p-2 border border-black rounded flex items-center justify-center ${
              g.symbolMatch ? "bg-green-800 text-white" : "bg-red-800 text-white"
            }`}>
            {g.symbol}
          </div>
        </div>
      ))}
    </div>
  );
}
