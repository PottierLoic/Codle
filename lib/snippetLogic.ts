import { Snippet, SnippetGuessResult } from "@/entities/Snippet";
import { Language } from "@/entities/Language";

export const compareGuess = (
  guessName: string,
  targetSnippet: Snippet,
  languages: Language[]
): SnippetGuessResult | null => {
  const targetLanguage = languages.find(lang => lang.id === targetSnippet.language_id);
  if (!targetLanguage) return null;
  const guessed = targetLanguage.name.toLowerCase() === guessName.toLowerCase();
  const matchingLanguage = languages.find(lang => lang.name.toLowerCase() === guessName.toLowerCase());
  return {
    language: guessName,
    languageMatch: guessed,
    icon: matchingLanguage?.icon || "",
  };
};
