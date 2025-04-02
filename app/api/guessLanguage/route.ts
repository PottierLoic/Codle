import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { LanguageGuessResult, FullLanguage } from "@/entities/Language";

let cachedDailyLanguage: FullLanguage | null = null;
let cachedDateKey: string | null = null;

async function getDailyLanguage(dateKey: string) {
  if (cachedDailyLanguage && cachedDateKey === dateKey) {
    return cachedDailyLanguage;
  }

  const { data: dailyIdData, error: dailyIdError } = await supabase
    .from("daily")
    .select("language_id")
    .eq("date", dateKey)
    .single();

  if (dailyIdError || !dailyIdData) {
    throw new Error(`Daily ID not found: ${dailyIdError?.message}`);
  }

  const { data: dailyLanguageData, error: dailyLanguageError } = await supabase
    .from("language")
    .select("*")
    .eq("id", dailyIdData.language_id)
    .single();

  if (dailyLanguageError || !dailyLanguageData) {
    throw new Error(`Daily language not found: ${dailyLanguageError?.message}`);
  }

  cachedDailyLanguage = dailyLanguageData;
  cachedDateKey = dateKey;

  return cachedDailyLanguage;
}

export async function POST(request: Request) {
  try {
    const { guessedLanguage } = await request.json();
    const dateKey = new Date().toISOString().slice(0, 10);

    const [guessedRes, dailyLanguageData] = await Promise.all([
      supabase.from("language").select("*").eq("name", guessedLanguage).single(),
      getDailyLanguage(dateKey)
    ]);

    if (guessedRes.error || !guessedRes.data) {
      console.error("[ERROR] Guessed language fetch failed:", guessedRes.error?.message);
      return NextResponse.json({ message: "Guessed language not found" }, { status: 404 });
    }

    const guessedData = guessedRes.data;

    if (!dailyLanguageData) {
      throw new Error("Daily language data is null");
    }

    const result: LanguageGuessResult = {
      name: guessedData.name,
      nameMatch: guessedData.name === dailyLanguageData.name,
      paradigms: guessedData.paradigms,
      paradigmsMatch:
        guessedData.paradigms.join(",") === dailyLanguageData.paradigms.join(",")
          ? "full"
          : guessedData.paradigms.some((p: string) => dailyLanguageData.paradigms.includes(p))
          ? "partial"
          : "none",
      year: guessedData.year,
      yearMatch:
        guessedData.year === dailyLanguageData.year
          ? "full"
          : guessedData.year > dailyLanguageData.year
          ? "lower"
          : "higher",
      typing: guessedData.typing,
      typingMatch: guessedData.typing === dailyLanguageData.typing,
      execution: guessedData.execution,
      executionMatch: guessedData.execution === dailyLanguageData.execution,
      gc: guessedData.gc,
      gcMatch: guessedData.gc === dailyLanguageData.gc,
      scope: guessedData.scope,
      scopeMatch:
        guessedData.scope.join(",") === dailyLanguageData.scope.join(",")
          ? "full"
          : guessedData.scope.some((s: string) => dailyLanguageData.scope.includes(s))
          ? "partial"
          : "none",
      symbol: guessedData.symbol,
      symbolMatch: guessedData.symbol === dailyLanguageData.symbol,
      icon: guessedData.icon,
      isFromStorage: false,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("[ERROR] Unexpected error in /api/guessLanguage route:", (error as Error).message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
