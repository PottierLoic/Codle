import { useEffect, useState } from "react";
import { PublicComplexity } from "@/entities/Complexity";
import { supabase } from "@/lib/supabase";

interface UseDailyComplexityProps {
  date: Date;
  enabled: boolean;
}

export default function useDailyComplexity({ date, enabled }: UseDailyComplexityProps) {
  const [dailyComplexity, setDailyComplexity] = useState<PublicComplexity | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) { return; }
    setLoading(true);
    let isMounted = true;

    const fetchData = async () => {
      try {
        const dateKey = date.toISOString().slice(0, 10);
        console.log(dateKey);

        const { data, error } = await supabase
          .from("daily")
          .select("complexity:complexity_id(id, snippet, language)")
          .eq("date", dateKey)
          .single();

        if (error || !data?.complexity) {
          console.error(`[ERROR] Failed to fetch complexity for ${dateKey}:`, error?.message);
          return;
        }

        const complexity = Array.isArray(data.complexity) ? data.complexity[0] : data.complexity;

        if (isMounted && complexity) {
          setDailyComplexity(complexity as PublicComplexity);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching daily complexity:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [date, enabled]);

  return { dailyComplexity, loading };
}
