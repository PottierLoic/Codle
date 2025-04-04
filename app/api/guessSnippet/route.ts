import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";
import { FullSnippet, SnippetGuessResult } from "@/entities/Snippet";
import { Language } from "@/entities/Language";

let cachedSnippet: FullSnippet | null = null;
let cachedDateKey: string | null = null;

async function getDailySnippet(): Promise<FullSnippet> {
  const dateKey = getTodayDateString();

  if (cachedSnippet && cachedDateKey === dateKey) {
    return cachedSnippet;
  }

  const { data: dailyData, error: dailyError } = await supabase
    .from("daily")
    .select("snippet_id")
    .eq("date", dateKey)
    .single();

  if (dailyError || !dailyData) {
    throw new Error(`Daily snippet ID not found: ${dailyError?.message}`);
  }

  const { data: snippetData, error: snippetError } = await supabase
    .from("snippet")
    .select("*")
    .eq("id", dailyData.snippet_id)
    .single();

  if (snippetError || !snippetData) {
    throw new Error(`Snippet not found: ${snippetError?.message}`);
  }

  cachedSnippet = snippetData;
  cachedDateKey = dateKey;

  return snippetData;
}

export async function POST(request: Request) {
  try {
    const { guessedLanguage } = await request.json();
    const dateKey = getTodayDateString();

    const [guessedRes, snippet] = await Promise.all([
      supabase.from("language").select("*").eq("name", guessedLanguage).single(),
      getDailySnippet()
    ]);

    if (guessedRes.error || !guessedRes.data) {
      console.error("[ERROR] Guessed language fetch failed:", guessedRes.error?.message);
      return NextResponse.json({ message: "Guessed language not found" }, { status: 404 });
    }

    const guessed = guessedRes.data as Language;

    const { data: correct, error: correctError } = await supabase
      .from("language")
      .select("*")
      .eq("id", snippet.language_id)
      .single();

    if (correctError || !correct) {
      console.error("[ERROR] Correct language fetch failed:", correctError?.message);
      return NextResponse.json({ message: "Correct language not found" }, { status: 500 });
    }

    const { data: guessData, error: fetchError } = await supabase
      .from("guess_snippet")
      .select("guess_count")
      .eq("language_id", guessed.id)
      .eq("date", dateKey)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("[ERROR] Failed to fetch guess count:", fetchError.message);
      return NextResponse.json({ message: "Guess count fetch failed" }, { status: 500 });
    }

    const newGuessCount = (guessData?.guess_count || 0) + 1;

    const { error: upsertError } = await supabase
      .from("guess_snippet")
      .upsert({
        language_id: guessed.id,
        date: dateKey,
        guess_count: newGuessCount,
      });

    if (upsertError) {
      console.error("[ERROR] Failed to update guess count:", upsertError.message);
      return NextResponse.json({ message: "Failed to update guess count" }, { status: 500 });
    }

    const result: SnippetGuessResult = {
      language: guessed.name,
      languageMatch: guessed.id === correct.id,
      icon: guessed.icon,
      guessCount: newGuessCount,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("[ERROR] Unexpected error in /api/guessSnippet route:", (error as Error).message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
