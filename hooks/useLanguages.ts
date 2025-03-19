import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Language {
  name: string;
  paradigms: string[];
  year: number;
  typing: string;
  execution: string;
  gc: boolean;
  scope: string[];
  symbol: string;
  icon: string;
  description: string;
  link: string;
  syntaxName: string;
}

export default function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data, error } = await supabase.from("language").select("*");
        if (error) {
          throw error;
        }
        const formattedData: Language[] = data.map((lang) => ({
          name: lang.name,
          paradigms: lang.paradigms,
          year: lang.year,
          typing: lang.typing,
          execution: lang.execution,
          gc: lang.gc,
          scope: lang.scope,
          symbol: lang.symbol,
          icon: lang.icon,
          description: lang.description,
          link: lang.link,
          syntaxName: lang.syntaxName,
        }));
        setLanguages(formattedData);
      } catch (error) {
        console.error("Error fetching languages: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);
  return { languages, loading };
}
