import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Language {
  id: number;
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
  creators: string[];
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
          id: lang.id,
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
          syntaxName: lang.syntax_name,
          creators: lang.creators,
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
  const fetchById = async (languageId: number): Promise<Language | null> => {
    try {
      const { data, error } = await supabase
        .from("language")
        .select("*")
        .eq("id", languageId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching language by ID:", error);
      return null;
    }
  };

  return { languages, loading, fetchById };
}
