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
  const guessedLang = languages.find(
    (lang) => lang.name.toLowerCase() === guessName.toLowerCase()
  );
  if (!guessedLang || !targetLanguage) return null;

  return {
    name: guessedLang.name,
    nameMatch: guessedLang.name === targetLanguage.name,
    paradigms: guessedLang.paradigms,
    paradigmsMatch:
      guessedLang.paradigms.join(",") === targetLanguage.paradigms.join(",")
        ? "full"
        : guessedLang.paradigms.some((p) => targetLanguage.paradigms.includes(p))
        ? "partial"
        : "none",
    year: guessedLang.year,
    yearMatch:
      guessedLang.year === targetLanguage.year
        ? "full"
        : guessedLang.year > targetLanguage.year
        ? "lower"
        : "higher",
    typing: guessedLang.typing,
    typingMatch: guessedLang.typing === targetLanguage.typing,
    execution: guessedLang.execution,
    executionMatch: guessedLang.execution === targetLanguage.execution,
    gc: guessedLang.gc,
    gcMatch: guessedLang.gc === targetLanguage.gc,
    scope: guessedLang.scope,
    scopeMatch:
      guessedLang.scope.join(",") === targetLanguage.scope.join(",")
        ? "full"
        : guessedLang.scope.some((s) => targetLanguage.scope.includes(s))
        ? "partial"
        : "none",
    symbol: guessedLang.symbol,
    symbolMatch: guessedLang.symbol === targetLanguage.symbol,
    icon: guessedLang.icon,
    isFromStorage: false,
  };
};