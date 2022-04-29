import { JSDOM } from "jsdom"
import { streakCounter } from '../src/index'
import { formatDate } from "../src/utils";

describe('streakCounter', () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" })

    mockLocalStorage = mockJSDom.window.localStorage;
  })

  afterEach(() => {
    mockLocalStorage.clear()
  })

  it('should return a streak object with currentCount, startDate and lastLoginDate', () => {
    const date = new Date()
    const streak = streakCounter(mockLocalStorage, date)
    expect(streak.hasOwnProperty('currentCount')).toBe(true)
    expect(streak.hasOwnProperty('startDate')).toBe(true)
    expect(streak.hasOwnProperty('lastLoginDate')).toBe(true)
  })

  it('should return a streak starting with currentCount 1 and keep track of lastLoginDate', () => {
    const date = new Date()

    const dateFormatted = formatDate(date)
    const streak = streakCounter(mockLocalStorage, date)
    expect(streak.currentCount).toBe(1)
    expect(streak.lastLoginDate).toBe(dateFormatted)
  })

  it('should store the streak in localStorage', () => {
    const date = new Date()
    const key = 'streak'

    const streak = streakCounter(mockLocalStorage, date)
    expect(mockLocalStorage.getItem('streak')).toBe(JSON.stringify(streak))
  })

  describe('with pre-existing streak in localStorage', () => {
    const yesterday = new Date((new Date()).getTime() - (24 * 60 * 60 * 1000))
    beforeEach(() => {
      const mockJSDom = new JSDOM('', {url: 'https://localhost' })

      mockLocalStorage = mockJSDom.window.localStorage


      const streak = {
        currentCount: 1,
        startDate: formatDate(yesterday),
        lastLoginDate: formatDate(yesterday),
      }

      mockLocalStorage.setItem('streak', JSON.stringify(streak))
    })
    afterEach(() => {
      mockLocalStorage.clear()
    })

    it('returns streak from localStorage', () => {
      const today = new Date()
      const streak = streakCounter(mockLocalStorage, today)

      expect(streak.startDate).toBe(formatDate(yesterday))
    })

    it('should increment the streak', () => {
        // It should increment because this is the day after
        // the streak started and a streak is days in a row.
        const date = new Date()
        const streak = streakCounter(mockLocalStorage, date)
        expect(streak.currentCount).toBe(2)
    })

    it('should not increment the streak when login days not consecutive', () => {
        // It should not increment because this is two days after
        // the streak started and the days aren't consecutive.
        const tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)
        const streak = streakCounter(mockLocalStorage, tomorrow)

        expect(streak.currentCount).toBe(1)
    })

    it('should save the incremented streak to localStorage', () => {
        const key = 'streak'
        const date = new Date()
        // Call it once so it updates the streak
        streakCounter(mockLocalStorage, date)

        const streakAsString = mockLocalStorage.getItem(key)
        // Normally you should wrap in try/catch in case the JSON is bad
        // but since we authored it, we can skip here
        const streak = JSON.parse(streakAsString || '')

        expect(streak.currentCount).toBe(2)
    })

    it('should reset if not consecutive', () => {
        const date = new Date()
        const streak = streakCounter(mockLocalStorage, date)

        expect(streak.currentCount).toBe(2)

        // Skip a day and break the streak
        const dateUpdated = new Date((new Date()).getTime() + 48 * 60 * 60 * 1000)

        const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

        expect(streakUpdated.currentCount).toBe(1)
    })

    it('should save the reset streak to localStorage', () => {
        const key = 'streak'
        const date = new Date()
        // Call it once so it updates the streak
        streakCounter(mockLocalStorage, date)

        // Skip a day and break the streak
        const dateUpdated = new Date((new Date()).getTime() + 48 * 60 * 60 * 1000)
        const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

        const streakAsString = mockLocalStorage.getItem(key)
        // Normally you should wrap in try/catch in case the JSON is bad
        // but since we authored it, we can skip here
        const streak = JSON.parse(streakAsString || '')

        expect(streak.currentCount).toBe(1)
    })

    it('should not reset the streak for same-day login', () => {
        const date = new Date()
        // Call it once so it updates the streak
        streakCounter(mockLocalStorage, date)

        // Simulate same-day login
        const dateUpdated = new Date()
        const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

        expect(streakUpdated.currentCount).toBe(2)
      })
  })
})
