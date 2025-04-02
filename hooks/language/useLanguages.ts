import { useEffect, useState } from "react";
import { Language } from '@/entities/Language';
import { supabase } from "@/lib/supabase";

// Used to fetch (id, name, icon) for all the languages in the db
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
          .select("id, name, icon")
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
  return { languages, loading };
}
