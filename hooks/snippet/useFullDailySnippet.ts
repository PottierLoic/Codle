import { useEffect, useState } from "react";
import { FullSnippet } from "@/entities/Snippet";
import { supabase } from "@/lib/supabase";

export default function useFullDailySnippet(inputDate?: Date | null) {
  const [dailySnippet, setDailySnippet] = useState<FullSnippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inputDate) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchDailySnippet = async () => {
      try {
        const dateKey = inputDate.toISOString().slice(0, 10);

        const { data: answerData, error: answerError } = await supabase
          .from("daily")
          .select("snippet_id")
          .eq("date", dateKey)
          .single();

        if (answerError || !answerData) {
          console.error(`[ERROR] No snippet found for ${dateKey}:`, answerError?.message);
          return;
        }

        const snippetId = answerData.snippet_id;
        const { data: snippetData, error: snippetError } = await supabase
          .from("snippet")
          .select("*")
          .eq("id", snippetId)
          .single();

        if (snippetError || !snippetData) {
          console.error(`[ERROR] Snippet ID ${snippetId} not found:`, snippetError?.message);
          return;
        }

        if (isMounted) setDailySnippet(snippetData as FullSnippet);
      } catch (error) {
        if (isMounted) {
          console.error("[ERROR] Unexpected error while fetching daily snippet:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDailySnippet();
    return () => { isMounted = false; };
  }, [inputDate]);

  return { dailySnippet, loading };
}
