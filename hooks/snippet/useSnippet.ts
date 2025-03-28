import { useState, useEffect } from "react";
import { Snippet } from '@/entities/Snippet';
import { supabase } from "@/lib/supabase";

export default function useSnippet(languageId: number | null) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!languageId) return;

    const fetchSnippet = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("snippet")
        .select("*")
        .eq("language_id", languageId)
        .limit(1)
        .single();

      if (error) {
        console.error("[ERROR] Failed to fetch snippet:", error.message);
        setSnippet(null);
      } else {
        setSnippet(data);
      }

      setLoading(false);
    };

    fetchSnippet();
  }, [languageId]);

  return { snippet, loading };
}
