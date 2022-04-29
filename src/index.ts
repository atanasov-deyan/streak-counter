import { formatDate } from "./utils"

interface Streak {
  currentCount: number
  startDate: string
  lastLoginDate: string
}

// used to access and store data in Storage
const KEY = 'streak'
export function streakCounter(storage: Storage, date: Date): Streak {
  const streakLocalStorage = storage.getItem(KEY)

  if (streakLocalStorage) {
    try {
        const streak = JSON.parse(streakLocalStorage)
        const state = 'INCREMENT'
        const shouldIncrement = state === 'INCREMENT'

        if (shouldIncrement) {
            const updatedStreak = {
                  ...streak,
                  currentCount: streak.currentCount + 1,
                  lastLoginDate: formatDate(date),
                }

                return updatedStreak
        }
        return streak
    } catch (err) {
        console.error('Failed to parse streak from localStorage')
    }
  }

  const streak = {
    currentCount: 1,
    startDate: formatDate(date),
    lastLoginDate: formatDate(date)
  }

  storage.setItem(KEY, JSON.stringify(streak))
  return streak
}
