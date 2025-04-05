import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";
import { LanguageGuessResult, FullLanguage } from "@/entities/Language";

let cachedDailyLanguage: FullLanguage | null = null;
let cachedDateKey: string | null = null;

async function getDailyLanguage() {
  const dateKey = getTodayDateString();

  if (cachedDailyLanguage && cachedDateKey === dateKey) {
    return cachedDailyLanguage;
  }

  const { data, error } = await supabase
    .from("daily")
    .select("language:language_id(*)")
    .eq("date", dateKey)
    .single();

  const language = Array.isArray(data?.language) ? data.language[0] : data?.language;

  if (error || !language) {
    throw new Error(`Failed to fetch daily language: ${error?.message}`);
  }

  cachedDailyLanguage = language;
  cachedDateKey = dateKey;

  return language;
}

export async function POST(request: Request) {
  try {
    const { guessedLanguage } = await request.json();
    const dateKey = getTodayDateString();

    const [guessedRes, dailyLanguageData] = await Promise.all([
      supabase.from("language").select("*").eq("name", guessedLanguage).single(),
      getDailyLanguage()
    ]);

    if (guessedRes.error || !guessedRes.data) {
      console.error("[ERROR] Guessed language fetch failed:", guessedRes.error?.message);
      return NextResponse.json({ message: "Guessed language not found" }, { status: 404 });
    }

    const guessedData = guessedRes.data;
    const { data: guessData, error: fetchError } = await supabase
      .from("guess_language")
      .select("guess_count")
      .eq("language_id", guessedData.id)
      .eq("date", dateKey)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("[ERROR] Failed to fetch guess count:", fetchError.message);
      return NextResponse.json({ message: "Failed to fetch guess count" }, { status: 500 });
    }

    const newGuessCount = (guessData?.guess_count || 0) + 1;

    const { error: incrementError } = await supabase
      .from("guess_language")
      .upsert({ language_id: guessedData.id, date: dateKey, guess_count: newGuessCount });

    if (incrementError) {
      console.error("[ERROR] Failed to increment guess count:", incrementError.message);
      return NextResponse.json({ message: "Failed to update guess count" }, { status: 500 });
    }

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
      guessCount: newGuessCount,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("[ERROR] Unexpected error in /api/guessLanguage route:", (error as Error).message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
