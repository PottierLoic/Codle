import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Snippet {
  snippet: string;
  language: string;
}

export default function useDailySnippet(inputDate?: Date) {
  const [dailySnippet, setDailySnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching daily snippet...");
    const fetchDailySnippet = async () => {
      try {
        let dateObj = inputDate || new Date();
        const dateKey = dateObj.toISOString().slice(0, 10);
        const { data: answerData, error: answerError } = await supabase
          .from("answer")
          .select("snippet_id")
          .eq("date", dateKey)
          .single();
        if (answerError || !answerData) {
          console.error(`[ERROR] No snippet found in 'answer' for ${dateKey}:`, answerError?.message);
          setDailySnippet(null);
          return;
        }
        const snippetId = answerData.snippet_id;
        const { data: snippetData, error: snippetError } = await supabase
          .from("snippet")
          .select("code, language_id")
          .eq("id", snippetId)
          .single();
        if (snippetError || !snippetData) {
          console.error(`[ERROR] Snippet ID ${snippetId} not found in 'snippet' table:`, snippetError?.message);
          setDailySnippet(null);
          return;
        }
        const { data: languageData, error: languageError } = await supabase
          .from("language")
          .select("name")
          .eq("id", snippetData.language_id)
          .single();

        if (languageError || !languageData) {
          console.error(`[ERROR] Language ID ${snippetData.language_id} not found in 'language' table:`, languageError?.message);
          setDailySnippet(null);
          return;
        }
        setDailySnippet({
          snippet: snippetData.code,
          language: languageData.name,
        });
      } catch (error) {
        console.error("[ERROR] Unexpected error fetching daily snippet:", error);
        setDailySnippet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDailySnippet();
  }, [inputDate]);
  return { dailySnippet, loading };
}
