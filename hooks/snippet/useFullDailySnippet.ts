import { useEffect, useState } from "react";
import { FullSnippet } from "@/entities/Snippet";
import { supabase } from "@/lib/supabase";

interface UseFullDailySnippetProps {
  date: Date;
  enabled: boolean;
}

export default function useFullDailySnippet({date, enabled}: UseFullDailySnippetProps) {
  const [dailySnippet, setDailySnippet] = useState<FullSnippet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) { return; }
    setLoading(true);
    let isMounted = true;

    const fetchData = async () => {
      try {
        const dateKey = date.toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from("daily")
          .select("snippet:snippet_id(*)")
          .eq("date", dateKey)
          .single();

        if (error || !data?.snippet) {
          console.error(`[ERROR] Failed to fetch full snippet for ${dateKey}:`, error?.message);
          return;
        }

        if (isMounted) {
          const snippet = Array.isArray(data.snippet) ? data.snippet[0] : data.snippet;
          if (snippet) {
            setDailySnippet(snippet as FullSnippet);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("[ERROR] Unexpected error while fetching daily snippet:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [date, enabled]);

  return { dailySnippet, loading };
}
