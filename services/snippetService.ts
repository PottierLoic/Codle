import { SnippetGuessResult } from "@/entities/Snippet";

export async function fetchSnippetCode(): Promise<{ code: string }> {
  const res = await fetch("/api/snippet");
  if (!res.ok) throw new Error("Failed to load snippet code");
  return res.json();
}

export async function submitSnippetGuess(guessedLanguage: string): Promise<SnippetGuessResult> {
  const res = await fetch("/api/guessSnippet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guessedLanguage }),
  });
  if (!res.ok) throw new Error("Failed to submit guess");
  return res.json();
}
