import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Regex } from "@/entities/Regex";

export default function useDailyRegex(inputDate?: Date) {
  const [dailyRegex, setDailyRegex] = useState<Regex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        let dateObj = inputDate || new Date();
        const dateKey = dateObj.toISOString().slice(0, 10);
        const { data: dailyData, error: dailyError } = await supabase
          .from("daily")
          .select("regex_id")
          .eq("date", dateKey)
          .single();
        if (dailyError || !dailyData) {
          console.error(`[ERROR] No regex challenge found for ${dateKey}:`, dailyError?.message);
          return;
        }
        const regexId = dailyData.regex_id;
        const { data: regexData, error: regexError } = await supabase
          .from("regex")
          .select("id, source_text, target_text, instruction")
          .eq("id", regexId)
          .single();
        if (regexError || !regexData) {
          console.error(`[ERROR] Regex ID ${regexId} not found in 'regex' table:`, regexError?.message);
          return;
        }
        if (isMounted) setDailyRegex(regexData as Regex);
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching daily regex challenge:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [inputDate]);
  return { dailyRegex, loading };
}