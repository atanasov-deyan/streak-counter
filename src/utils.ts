import { KEY } from './constants';

export interface Streak {
    currentCount: number
    startDate: string
    lastLoginDate: string
  }

export type StreakAction = 'INCREMENT' | 'RESET' | 'NONE'

export function formatDate(date: Date): string {
    // returns date as 29/03/2021
    return date.toLocaleDateString('en-GB')
}

export function buildStreak(
    date: Date,
    overrideDefaults?: Partial<Streak>,
): Streak {
    const defaultStreak: Streak = {
        currentCount: 1,
        startDate: formatDate(date),
        lastLoginDate: formatDate(date),
    }

    return {
        ...defaultStreak,
        ...overrideDefaults,
    }
}

export function updateStreak(storage: Storage, streak: Streak): void {
    storage.setItem(KEY, JSON.stringify(streak))
}
