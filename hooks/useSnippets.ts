import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export interface Snippet {
  snippet: string;
  language: string;
  hint?: string;
}

export default function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "snippets"));
        const snippetsData: Snippet[] = querySnapshot.docs.map(doc => doc.data() as CodeSnippet);
        setSnippets(snippetsData);
      } catch (error) {
        console.error("Error fetching snippets: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  return { snippets, loading };
}
