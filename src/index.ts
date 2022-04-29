import { buildStreak, formatDate, Streak, StreakAction, updateStreak } from "./utils"
import { KEY, INCREMENT, NONE, RESET } from './constants'
function shouldIncrementOrResetStreakCount(
    currentDate: Date,
    lastLoginDate: string,
): StreakAction {
    const difference = currentDate.getDate() - parseInt(lastLoginDate.split('/')[0])

    if (difference === 0) {
        return NONE
    }

    if (difference === 1) {
        return INCREMENT
    }

    return RESET
}
// used to access and store data in Storage
export function streakCounter(storage: Storage, date: Date): Streak {
  const streakLocalStorage = storage.getItem(KEY)

  if (streakLocalStorage) {
    try {
        const streak = JSON.parse(streakLocalStorage) as Streak
        const state = shouldIncrementOrResetStreakCount(date, streak.lastLoginDate)
        const shouldIncrement = state === INCREMENT
        const shouldReset = state === RESET

        if (shouldIncrement) {
            const updatedStreak = buildStreak(date, {
                startDate: streak.startDate,
                currentCount: streak.currentCount + 1,
                lastLoginDate: formatDate(date),
            })
                // store updated streak in localStorage
                updateStreak(storage, updatedStreak)
                return updatedStreak
        }

        if (shouldReset) {
            const updatedStreak = buildStreak(date)

            updateStreak(storage, updatedStreak)
            return updatedStreak
        }
        return streak
    } catch (err) {
        console.error('Failed to parse streak from localStorage')
    }
  }

  const streak = buildStreak(date)

  updateStreak(storage, streak)
  return streak
}
