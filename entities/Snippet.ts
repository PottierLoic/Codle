export interface Snippet {
  id: number;
  code: string;
}

export interface FullSnippet {
  id: number;
  code: string;
  language_id: number;
  languageName?: string;
  description: string;
  link: string;
}

export interface SnippetGuessResult {
  id?: string;
  language: string;
  languageMatch: boolean;
  icon?: string;
  isFromStorage?: boolean;
  guessCount?: number;
}