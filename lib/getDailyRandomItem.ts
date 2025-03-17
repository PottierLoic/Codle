function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(seed: number) {
  return function() {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + (t ^ (t >>> 7))) | 0
    return (t ^ (t >>> 14)) >>> 0
  }
}

export function getDailyRandomItem<T>(
  items: T[],
  date: Date = new Date()
): T | null {
  if (!items.length) return null
  const dayString = date.toISOString().slice(0, 10)
  const seedFn = xmur3(dayString)
  const seed = seedFn()
  const rand32 = mulberry32(seed)
  const randomInt = rand32()
  const randFloat = randomInt / 2 ** 32
  const index = Math.floor(randFloat * items.length)
  return items[index]
}
