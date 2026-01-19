export interface PublicComplexity {
  id: number;
  language: string;
  snippet: string;
}

export interface FullComplexity extends PublicComplexity {
  id: number;
  snippet: string;
  solution: string;
  explanation: string;
}

export interface ComplexityGuessResult {
  correct: boolean;
  trend: "higher" | "lower";
}
