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
    const yesterday = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)
    beforeEach(() => {
      const mockJSDom = new JSDOM('', {url: 'https://localhost'})

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
  })
})
