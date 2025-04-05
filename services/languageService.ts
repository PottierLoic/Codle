import { LanguageGuessResult } from "@/entities/Language";

export async function submitLanguageGuess(guessedLanguage: string): Promise<LanguageGuessResult> {
  const res = await fetch("/api/guessLanguage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guessedLanguage }),
  });
  if (!res.ok) throw new Error("Failed to submit guess");
  return res.json();
}

export async function fetchLanguageHint(hintType: string): Promise<{ nameLength?: number; creators?: string[] }> {
  const res = await fetch(`/api/hint?hintType=${hintType}`);
  if (!res.ok) throw new Error(`Failed to fetch ${hintType} hint`);
  return res.json();
}
