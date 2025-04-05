import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RegexSolution } from "@/entities/Regex";

interface UseRegexSolutionsProps {
  enabled: boolean;
}

export default function useRegexSolutions({ enabled }: UseRegexSolutionsProps) {
  const [solutions, setSolutions] = useState<RegexSolution[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSolutions = async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      const dateKey = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase.from("today_regex_solutions").select("*");

      if (error || !data) {
        console.error(`[ERROR] Failed to fetch solutions for date ${dateKey}:`, error?.message);
        return;
      }

      setSolutions(data);
    } catch (err) {
      console.error("Error fetching regex solutions:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSolutions();
  }, [enabled]);

  return { solutions, loading, refetch: fetchSolutions };
}
