import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Language } from "./useLanguages";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function useDailyLanguage(inputDate?: Date) {
  const [dailyLanguage, setDailyLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyLanguage = async () => {
      try {
        let dateObj = inputDate || new Date();
        const dateKey = dateObj.toISOString().slice(0, 10);
        const { data: answerData, error: answerError } = await supabase
          .from("answer")
          .select("language_id")
          .eq("date", dateKey)
          .single();

        if (answerError || !answerData) {
          throw new Error(`No language found for ${dateKey}`);
        }
        const languageId = answerData.language_id;
        const { data: langData, error: langError } = await supabase
          .from("language")
          .select("*")
          .eq("id", languageId)
          .single();
        if (langError || !langData) {
          throw new Error(`Language ID ${languageId} not found in 'language' table`);
        }
        setDailyLanguage(langData as Language);
      } catch (error) {
        console.error("Error fetching daily language:", error);
        setDailyLanguage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDailyLanguage();
  }, [inputDate]);
  return { dailyLanguage, loading };
}
