import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";

export async function GET() {
  try {
    const dateKey = getTodayDateString();

    const { data, error } = await supabase
      .from("daily")
      .select("snippet:snippet_id(code)")
      .eq("date", dateKey)
      .single();

    const snippet = Array.isArray(data?.snippet) ? data.snippet[0] : data?.snippet;

    if (error || !snippet?.code) {
      console.error("[ERROR] Failed to fetch today's snippet code:", error?.message);
      return NextResponse.json({ message: "Snippet code not found" }, { status: 404 });
    }

    return NextResponse.json({ code: snippet.code });
  } catch (error: unknown) {
    console.error("[ERROR] Unexpected error in /api/snippet:", (error as Error).message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
