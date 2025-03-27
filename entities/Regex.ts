export interface Regex {
  id: number;
  source_text: string;
  target_text: string;
  instruction: string;
}

export interface RegexSolution {
  id: number;
  regex_id: number;
  pattern: string;
  replacement: string | null;
}