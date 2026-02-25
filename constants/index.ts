export const STORAGE_KEYS = {
  LANGUAGE_GUESSES: "languageGuesses",
  SNIPPET_GUESSES: "snippetGuesses",
  REGEX_SOLUTION: "regex-solution",
  COMPLEXITY_GUESSES: "complexityGuesses",
} as const;

export const GUESS_THRESHOLDS = [3, 6, 9] as const;