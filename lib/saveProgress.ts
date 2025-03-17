export function loadProgress<T>(key: string, dayString: string): T | null {
  const storageKey = `${key}-${dayString}`
  const data = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null
  return data ? JSON.parse(data) : null
}

export function saveProgress<T>(key: string, dayString: string, data: T) {
  const storageKey = `${key}-${dayString}`
  if (typeof window !== "undefined") {
    localStorage.setItem(storageKey, JSON.stringify(data))
  }
}