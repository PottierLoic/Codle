import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function getDailyLanguageId() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("daily")
    .select("language_id")
    .eq("date", today)
    .single();

  if (error || !data) throw new Error("Daily language not found");

  return data.language_id;
}

export async function GET(request: NextRequest) {
  const hintType = request.nextUrl.searchParams.get("hintType");
  if (!hintType) {
    return NextResponse.json({ error: "Missing hintType" }, { status: 400 });
  }

  try {
    const languageId = await getDailyLanguageId();

    switch (hintType) {
      case "nameLength": {
        const { data, error } = await supabase
          .from("language")
          .select("name")
          .eq("id", languageId)
          .single();

        if (error || !data) throw new Error("Language name not found");

        return NextResponse.json({ nameLength: data.name.length });
      }

      case "creators": {
        const { data, error } = await supabase
          .from("language")
          .select("creators")
          .eq("id", languageId)
          .single();

        if (error || !data) throw new Error("Language creators not found");

        return NextResponse.json({ creators: data.creators });
      }

      default:
        return NextResponse.json({ error: "Invalid hint type" }, { status: 400 });
    }
  } catch (err) {
    console.error("[Hint API Error]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
