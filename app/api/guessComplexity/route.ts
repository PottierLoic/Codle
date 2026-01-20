import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";
import type { FullComplexity, ComplexityGuessResult } from "@/entities/Complexity";

async function getDailyComplexity(): Promise<FullComplexity> {
  const dateKey = getTodayDateString();

  const { data, error } = await supabase
    .from("daily")
    .select("complexity:complexity_id(id, snippet, solution, explanation)")
    .eq("date", dateKey)
    .single();

  const complexity = Array.isArray(data?.complexity) ? data?.complexity[0] : data?.complexity;

  if (error || !complexity) {
    throw new Error(`Failed to fetch daily complexity: ${error?.message}`);
  }

  return complexity as FullComplexity;
}

const COMPLEXITY_RANK: Record<string, number> = {
  "O(1)": 1,
  "O(log n)": 2,
  "O(n)": 3,
  "O(n log n)": 4,
  "O(n²)": 5,
  "O(2^n)": 6,
};


function getRank(label: string): number | null {
  return COMPLEXITY_RANK[label] ?? null;
}

export async function POST(request: Request) {
  try {
    const { guessedComplexity } = (await request.json()) as { guessedComplexity?: string };

    if (!guessedComplexity || typeof guessedComplexity !== "string") {
      return NextResponse.json({ message: "Missing guessedComplexity" }, { status: 400 });
    }

    const daily = await getDailyComplexity();

    const guessNorm = guessedComplexity;
    const solutionNorm = daily.solution;

    const correct = guessNorm === solutionNorm;

    let trend: "higher" | "lower" = "lower";

    const guessRank = getRank(guessNorm);
    const solutionRank = getRank(solutionNorm);

    if (guessRank !== null && solutionRank !== null) {
      trend = guessRank > solutionRank ? "higher" : "lower";
    } else {
      trend = "lower";
    }

    const result: ComplexityGuessResult = {
      correct,
      trend,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(
      "[ERROR] Unexpected error in /api/guessComplexity route:",
      (error as Error).message
    );
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
