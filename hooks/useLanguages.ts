import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

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
}

export default function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "languages"));
        const langData = querySnapshot.docs.map(doc => doc.data() as Language);
        setLanguages(langData);
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