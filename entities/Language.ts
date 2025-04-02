export interface Language {
  id: number;
  name: string;
  icon: string;
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
}