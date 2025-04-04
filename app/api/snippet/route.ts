import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";

export async function GET() {
  try {
    const dateKey = getTodayDateString();

    // Get the snippet ID for today
    const { data: dailyData, error: dailyError } = await supabase
      .from("daily")
      .select("snippet_id")
      .eq("date", dateKey)
      .single();

    if (dailyError || !dailyData) {
      console.error("[ERROR] Failed to fetch today's snippet_id:", dailyError?.message);
      return NextResponse.json({ message: "Snippet ID not found" }, { status: 404 });
    }

    const snippetId = dailyData.snippet_id;

    // Fetch the code of the snippet
    const { data: snippetData, error: snippetError } = await supabase
      .from("snippet")
      .select("code")
      .eq("id", snippetId)
      .single();

    if (snippetError || !snippetData) {
      console.error("[ERROR] Failed to fetch snippet code:", snippetError?.message);
      return NextResponse.json({ message: "Snippet code not found" }, { status: 404 });
    }

    return NextResponse.json({ code: snippetData.code });
  } catch (error: unknown) {
    console.error("[ERROR] Unexpected error in /api/snippet:", (error as Error).message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
