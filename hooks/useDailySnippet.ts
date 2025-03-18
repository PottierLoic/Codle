import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebaseConfig"
import { Snippet } from "./useSnippets"

export default function useDailySnippet(inputDate?: Date) {
  const [dailySnippet, setDailySnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDailySnippet = async () => {
      try {
        let dateObj = inputDate || new Date()
        const dateKey = dateObj.toISOString().slice(0, 10)
        const docRef = doc(db, "dailySnippet", dateKey)
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
          setDailySnippet(snapshot.data() as Snippet)
        } else {
          setDailySnippet(null)
        }
      } catch (error) {
        console.error("Error fetching daily snippet:", error)
        setDailySnippet(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDailySnippet()
  }, [inputDate])
  return { dailySnippet, loading }
}
