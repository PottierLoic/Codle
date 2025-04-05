import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Regex } from "@/entities/Regex";

export default function useDailyRegex() {
  const [dailyRegex, setDailyRegex] = useState<Regex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const dateKey = new Date().toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from("daily")
          .select("regex:regex_id(id, source_text, target_text, instruction)")
          .eq("date", dateKey)
          .single();

        if (error || !data?.regex) {
          console.error(`[ERROR] Failed to fetch regex challenge for ${dateKey}:`, error?.message);
          return;
        }

        const regex = Array.isArray(data.regex) ? data.regex[0] : data.regex;
        if (isMounted && regex) setDailyRegex(regex as Regex);
      } catch (err) {
        if (isMounted) console.error("Error fetching daily regex challenge:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { dailyRegex, loading };
}
