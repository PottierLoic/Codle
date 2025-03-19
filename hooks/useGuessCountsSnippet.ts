import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function useGuessCountsCode() {
  const [guessCounts, setGuessCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchGuessCounts = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("guess_snippet")
          .select("guess_count, language_id")
          .eq("date", today);
        if (error) {
          throw error;
        }
        const { data: languages, error: langError } = await supabase
          .from("language")
          .select("id, name");
        if (langError) {
          throw langError;
        }
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
      } catch (error) {
        console.error("Error fetching guess counts:", error);
      }
    };
    fetchGuessCounts();
  }, []);

  const incrementGuessCount = async (languageName: string) => {
    const today = new Date().toISOString().split("T")[0];
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
  return { guessCounts, incrementGuessCount };
}
