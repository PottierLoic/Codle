import { Language, LanguageGuessResult } from "@/entities/Language";

export const compareGuess = (guessName: string, targetLanguage: Language, languages: Language[]): LanguageGuessResult | null => {
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