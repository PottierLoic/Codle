import { useEffect, useState } from "react";
import { Language } from '@/entities/Language';
import { supabase } from "@/lib/supabase";

export default function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedData = sessionStorage.getItem('languages');
    if (cachedData) {
      setLanguages(JSON.parse(cachedData));
      setLoading(false);
      return;
    }
    const fetchLanguages = async () => {
      try {
        const { data, error } = await supabase
          .from("language")
          .select("*")
          .order("name");

        if (error) {
          console.error("[ERROR] Failed to fetch languages:", error.message);
          return;
        }

        const formattedData = data as Language[];
        setLanguages(formattedData);
        sessionStorage.setItem('languages', JSON.stringify(formattedData));
      } catch (err) {
        console.error("[ERROR] Unexpected error:", err);
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
