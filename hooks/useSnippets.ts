import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface CodeSnippet {
  snippet: string;
  language: string;
  hint?: string;
}

export default function useSnippets() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "codeSnippetsGame"));
        const snippetsData: CodeSnippet[] = querySnapshot.docs.map(doc => doc.data() as CodeSnippet);
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
