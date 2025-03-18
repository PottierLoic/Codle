import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebaseConfig"
import { Language } from "./useLanguages"

export default function useDailyLanguage(inputDate?: Date) {
  const [dailyLanguage, setDailyLanguage] = useState<Language | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDailyLanguage = async () => {
      try {
        let dateObj = inputDate || new Date()
        const dateKey = dateObj.toISOString().slice(0, 10)
        const docRef = doc(db, "dailyLanguage", dateKey)
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
          setDailyLanguage(snapshot.data() as Language)
        } else {
          setDailyLanguage(null)
        }
      } catch (error) {
        console.error("Error fetching daily language:", error)
        setDailyLanguage(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDailyLanguage()
  }, [inputDate])
  return { dailyLanguage, loading }
}
