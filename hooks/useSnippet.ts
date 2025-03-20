import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Snippet {
  id: number;
  code: string;
  language_id: number;
  languageName?: string;
}

export default function useSnippet(languageId: number | null) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!languageId) return;

    const fetchSnippet = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("snippet")
        .select("*")
        .eq("language_id", languageId)
        .limit(1)
        .single();

      console.log(data);
      if (error) {
        setError("Error fetching snippet");
        setSnippet(null);
      } else {
        setSnippet(data);
      }

      setLoading(false);
    };

    fetchSnippet();
  }, [languageId]);

  return { snippet, loading, error };
}
