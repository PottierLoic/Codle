import { useEffect, useState } from "react";
import { Snippet } from "@/entities/Snippet";
import { supabase } from "@/lib/supabase";
import { getTodayString } from "@/lib/utils";

export default function useDailySnippet(inputDate?: Date) {
  const [dailySnippet, setDailySnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailySnippet = async () => {
      try {
        const dateKey = inputDate ? inputDate.toISOString().slice(0, 10) : getTodayString();
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
          .select("*")
          .eq("id", snippetId)
          .single();
        if (snippetError || !snippetData) {
          console.error(`[ERROR] Snippet ID ${snippetId} not found in 'snippet' table:`, snippetError?.message);
          setDailySnippet(null);
          return;
        }
        setDailySnippet({
          id: snippetData.id,
          code: snippetData.code,
          language_id: snippetData.language_id,
        });
      } catch (error) {
        console.error("[ERROR] Unexpected error:", error);
        setDailySnippet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDailySnippet();
  }, [inputDate]);
  return { dailySnippet, loading };
}
