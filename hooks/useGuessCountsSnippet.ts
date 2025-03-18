import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export default function useGuessCountsCode() {
  const [guessCounts, setGuessCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchGuessCounts = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const querySnapshot = await getDocs(collection(db, "dailyGuessesCodeGame"));
        const counts: { [key: string]: number } = {};
        querySnapshot.forEach((doc) => {
          if (doc.id.startsWith(today)) {
            const langName = doc.id.split("_")[1];
            counts[langName] = doc.data().count;
          }
        });
        setGuessCounts(counts);
      } catch (error) {
        console.error("Error fetching guess counts:", error);
      }
    };
    fetchGuessCounts();
  }, []);

  const incrementGuessCount = async (languageName: string) => {
    const today = new Date().toISOString().split("T")[0];
    const languageRef = doc(db, "dailyGuessesCodeGame", `${today}_${languageName}`);

    setGuessCounts((prevCounts) => ({
      ...prevCounts,
      [languageName]: (prevCounts[languageName] || 0) + 1,
    }));

    try {
      await setDoc(languageRef, { count: increment(1) }, { merge: true });
    } catch (error) {
      console.error("Error updating guess count: ", error);
    }
  };

  return { guessCounts, incrementGuessCount };
}
