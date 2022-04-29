import { formatDate } from "./utils"

const KEY = 'streak'
const  INCREMENT = 'INCREMENT'
const dayInMs = 24 * 60 * 60 * 1000

interface Streak {
  currentCount: number
  startDate: string
  lastLoginDate: string
}

function shouldIncrementOrResetStreakCount(
    currentDate: Date,
    lastLoginDate: string,
): 'INCREMENT' | undefined {
    const difference = currentDate.getDate() - parseInt(lastLoginDate.split('/')[0])
    console.log({difference, currentDate, lastLoginDate})
    if (difference === 1) {
        return INCREMENT
    }

    return undefined
}
// used to access and store data in Storage
export function streakCounter(storage: Storage, date: Date): Streak {
  const streakLocalStorage = storage.getItem(KEY)

  if (streakLocalStorage) {
    try {
        const streak = JSON.parse(streakLocalStorage)
        const state = shouldIncrementOrResetStreakCount(date, streak.lastLoginDate)
        const shouldIncrement = state === INCREMENT

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
