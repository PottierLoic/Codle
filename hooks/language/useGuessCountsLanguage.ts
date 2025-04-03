import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";

export default function useGuessCountsLanguage() {
  const [guessCounts, setGuessCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuessCounts = async () => {
      try {
        const today = getTodayDateString();
        const { data, error: countError } = await supabase
          .from("guess_language")
          .select("guess_count, language_id")
          .eq("date", today);
        if (countError) throw new Error(countError.message);

        const { data: languages, error: langError } = await supabase
          .from("language")
          .select("id, name");
        if (langError) throw new Error(langError.message);

        const languageMap = Object.fromEntries(
          languages.map((lang) => [lang.id, lang.name])
        );
        const counts: { [key: string]: number } = {};
        data.forEach((entry) => {
          const langName = languageMap[entry.language_id];
          if (langName) {
            counts[langName] = entry.guess_count;
          }
        });
        setGuessCounts(counts);
      } catch (err) {
        console.error('Failed to fetch guess counts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuessCounts();
  }, []);
  return { guessCounts, loading };
}
