import { Language } from "@/hooks/useLanguages";

export interface GuessResult {
  id?: string;
  name: string;
  nameMatch: boolean;
  paradigms: string[];
  paradigmsMatch: "full" | "partial" | "none";
  year: number;
  yearMatch: "higher" | "lower" | "full";
  typing: string;
  typingMatch: boolean;
  execution: string;
  executionMatch: boolean;
  gc: boolean;
  gcMatch: boolean;
  scope: string[];
  scopeMatch: "full" | "partial" | "none";
  symbol: string;
  symbolMatch: boolean;
  icon: string;
  isFromStorage?: boolean;
}

export const compareGuess = (guessName: string, targetLanguage: Language, languages: Language[]): GuessResult | null => {
  const guessedLanguage = languages.find(
    (language) => language.name.toLowerCase() === guessName.toLowerCase()
  );
  if (!guessedLanguage || !targetLanguage) return null;

  return {
    name: guessedLanguage.name,
    nameMatch: guessedLanguage.name === targetLanguage.name,
    paradigms: guessedLanguage.paradigms,
    paradigmsMatch:
      guessedLanguage.paradigms.join(",") === targetLanguage.paradigms.join(",")
        ? "full"
        : guessedLanguage.paradigms.some((p) => targetLanguage.paradigms.includes(p))
        ? "partial"
        : "none",
    year: guessedLanguage.year,
    yearMatch:
      guessedLanguage.year === targetLanguage.year
        ? "full"
        : guessedLanguage.year > targetLanguage.year
        ? "lower"
        : "higher",
    typing: guessedLanguage.typing,
    typingMatch: guessedLanguage.typing === targetLanguage.typing,
    execution: guessedLanguage.execution,
    executionMatch: guessedLanguage.execution === targetLanguage.execution,
    gc: guessedLanguage.gc,
    gcMatch: guessedLanguage.gc === targetLanguage.gc,
    scope: guessedLanguage.scope,
    scopeMatch:
      guessedLanguage.scope.join(",") === targetLanguage.scope.join(",")
        ? "full"
        : guessedLanguage.scope.some((s) => targetLanguage.scope.includes(s))
        ? "partial"
        : "none",
    symbol: guessedLanguage.symbol,
    symbolMatch: guessedLanguage.symbol === targetLanguage.symbol,
    icon: guessedLanguage.icon,
    isFromStorage: false,
  };
};