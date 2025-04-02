import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTodayDateString } from "@/lib/utils";

export default function useGuessCountsSnippet() {
  const [guessCounts, setGuessCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuessCounts = async () => {
      try {
        const today = getTodayDateString();
        const { data, error: countError } = await supabase
          .from("guess_snippet")
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

  const incrementGuessCount = async (languageName: string) => {
    const today = getTodayDateString();
    try {
      const { data, error } = await supabase
        .from("language")
        .select("id")
        .eq("name", languageName)
        .single();
      if (error || !data) {
        throw new Error(`Language '${languageName}' not found`);
      }
      const languageId = data.id;
      setGuessCounts((prevCounts) => ({
        ...prevCounts,
        [languageName]: (prevCounts[languageName] || 0) + 1,
      }));
      const { error: upsertError } = await supabase
        .from("guess_snippet")
        .upsert({ date: today, language_id: languageId, guess_count: (guessCounts[languageName] || 0) + 1 });
      if (upsertError) {
        throw upsertError;
      }
    } catch (error) {
      console.error("Error updating guess count: ", error);
    }
  };
  return { guessCounts, loading, incrementGuessCount };
}
