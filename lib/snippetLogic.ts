import { Snippet } from "@/hooks/useSnippets";
import { Language } from "@/hooks/useLanguages";

export interface GuessResult {
  id?: string;
  language: string;
  languageMatch: boolean;
  icon?: string;
  isFromStorage?: boolean;
}

export const compareGuess = (guessName: string, targetSnippet: Snippet, languages: Language[]): GuessResult | null => {
  const guessed = targetSnippet.language.toLowerCase() === guessName.toLowerCase()
  const matchingLanguage = languages.find(lang => lang.name.toLowerCase() === guessName.toLowerCase());

  return {
    language: guessName,
    languageMatch: guessed,
    icon: matchingLanguage?.icon || "",
  }
}