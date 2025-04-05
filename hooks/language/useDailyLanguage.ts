import { useEffect, useState } from "react";
import { FullLanguage } from "@/entities/Language";
import { supabase } from "@/lib/supabase";

interface UseDailyLanguageProps {
  date: Date;
  enabled: boolean;
}

// Used to fetch full data on the daily language from the db
export default function useDailyLanguage({ date, enabled }: UseDailyLanguageProps) {
  const [dailyLanguage, setDailyLanguage] = useState<FullLanguage | null>(null);
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
          .select("language:language_id(*)")
          .eq("date", dateKey)
          .single();

        if (error || !data?.language) {
          console.error(`[ERROR] Failed to fetch full language for ${dateKey}:`, error?.message);
          return;
        }

        const lang = Array.isArray(data.language) ? data.language[0] : data.language;

        if (isMounted && lang) {
          setDailyLanguage(lang as FullLanguage);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching daily language:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [date, enabled]);

  return { dailyLanguage, loading };
}
