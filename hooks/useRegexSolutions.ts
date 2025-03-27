import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RegexSolution } from "@/entities/Regex";

export default function useRegexSolutions(inputDate?: Date) {
  const [solutions, setSolutions] = useState<RegexSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchSolutions = async () => {
    try {
      const dateObj = inputDate || new Date();
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
      const { data: solutionData, error: solutionError } = await supabase
        .from("regex_solutions")
        .select("id, regex_id, pattern, replacement")
        .eq("regex_id", regexId);
      if (solutionError || !solutionData) {
        console.error(`[ERROR] Failed to fetch solutions for regex ID ${regexId}:`, solutionError?.message);
        return;
      }
      setSolutions(solutionData);
    } catch (err) {
      console.error("Error fetching regex solutions:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSolutions();
  }, [inputDate]);
  return { solutions, loading, refetch: fetchSolutions };
}