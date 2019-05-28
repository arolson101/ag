import debug from 'debug'
import { DateTime } from 'luxon'

const log = debug('util:date')

interface MakeDateParams {
  year?: number
  month?: number // 0-11
  day?: number
}

// export const ShortDate: FormattedDate.PropsBase = ({
//   day: 'numeric',
//   month: 'numeric',
//   year: 'numeric'
// })

export const makeDate = ({ year, month, day }: MakeDateParams): Date => {
  if (year === undefined) {
    throw new Error('year is not set')
  }
  if (month === undefined) {
    throw new Error('month is not set')
  }
  if (day === undefined) {
    throw new Error('day is not set')
  }

  // set to 12pm UTC so that date is the same in all timezones
  return DateTime.utc(year, month + 1, day, 12).toJSDate()
}

export const formatDate = (date: Date): string => {
  // log('formatDate %o', { date })
  return DateTime.fromJSDate(date).toLocaleString()
}

export const standardizeDate = (date: Date): Date => {
  const value = makeDate({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  })
  return value
}

export const monthsAgo = (n: number) => {
  return standardizeDate(
    DateTime.fromJSDate(new Date())
      .minus({ months: 1 })
      .toJSDate()
  )
}
