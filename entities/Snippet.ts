export interface Snippet {
  id: number;
  code: string;
  language_id: number;
  languageName?: string;
}

export interface SnippetGuessResult {
  id?: string;
  language: string;
  languageMatch: boolean;
  icon?: string;
  isFromStorage?: boolean;
} 