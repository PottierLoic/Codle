import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FullLanguage } from "@/entities/Language";

export default function useFullLanguage(languageId: number | null) {
  const [language, setLanguage] = useState<FullLanguage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!languageId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchLanguage = async () => {
      try {
        const { data, error } = await supabase
          .from("language")
          .select("*")
          .eq("id", languageId)
          .single();

        if (error || !data) {
          console.error(`[ERROR] Language ID ${languageId} not found:`, error?.message);
          return;
        }

        if (isMounted) setLanguage(data as FullLanguage);
      } catch (err) {
        if (isMounted) console.error("[ERROR] Unexpected error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLanguage();
    return () => {
      isMounted = false;
    };
  }, [languageId]);

  return { language, loading };
}
