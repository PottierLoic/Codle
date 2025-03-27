import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SubmitParams {
  regexId: number;
  pattern: string;
  replacement: string;
  isOfficial?: boolean;
}

export default function useSubmitRegexSolution() {
  const [submitting, setSubmitting] = useState(false);
  const submitSolution = async ({
    regexId,
    pattern,
    replacement,
    isOfficial = false,
  }: SubmitParams) => {
    setSubmitting(true);
    await supabase.from("regex_solutions").insert([
      {
        regex_id: regexId,
        pattern,
        replacement,
        is_official: isOfficial,
      },
    ]);

    setSubmitting(false);
  };
  return { submitSolution, submitting };
}
