export interface Language {
  id: number;
  name: string;
  icon: string;
}

export interface FullLanguage {
  id: number;
  name: string;
  paradigms: string[];
  year: number;
  typing: string;
  execution: string;
  gc: boolean;
  scope: string[];
  symbol: string;
  icon: string;
  description: string;
  link: string;
  syntax_name: string;
  creators: string[];
}

export interface LanguageGuessResult {
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
  guessCount?: number;
}