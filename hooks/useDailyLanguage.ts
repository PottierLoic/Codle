import { useEffect, useState } from "react";
import { Language } from "@/entities/Language";
import { supabase } from "@/lib/supabase";

export default function useDailyLanguage(inputDate?: Date) {
  const [dailyLanguage, setDailyLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        let dateObj = inputDate || new Date();
        const dateKey = dateObj.toISOString().slice(0, 10);
        const { data: answerData, error: answerError } = await supabase
          .from("answer")
          .select("language_id")
          .eq("date", dateKey)
          .single();

        if (answerError || !answerData) {
          console.error(`[ERROR] No language found for ${dateKey}:`, answerError?.message);
          return;
        }
        const languageId = answerData.language_id;
        const { data: langData, error: langError } = await supabase
          .from("language")
          .select("*")
          .eq("id", languageId)
          .single();
        if (langError || !langData) {
          console.error(`[ERROR] Language ID ${languageId} not found in 'language' table:`, langError?.message);
          return;
        }
        if (isMounted) setDailyLanguage(langData as Language);
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
  }, [inputDate]);

  return { dailyLanguage, loading };
}
