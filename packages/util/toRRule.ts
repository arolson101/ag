import { Frequency as RRuleFrequency, Options as RRuleOptions, RRule } from 'rrule'

type Frequency = 'days' | 'weeks' | 'months' | 'years'
type EndType = 'endDate' | 'endCount'

interface Params {
  frequency: Frequency
  start?: Date
  end?: EndType
  until?: Date
  count?: number
  interval?: number
  byweekday?: string
  bymonth?: string
}

const toRRuleFreq: Record<string, RRuleFrequency> = {
  days: RRule.DAILY,
  weeks: RRule.WEEKLY,
  months: RRule.MONTHLY,
  years: RRule.YEARLY,
}

const rruleDays = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA]

export const toRRule = (params: Params): RRule => {
  const { frequency, start, end, until, count, interval, byweekday, bymonth } = params

  const opts: Partial<RRuleOptions> = {
    freq: toRRuleFreq[frequency],
    dtstart: start,
  }

  if (interval) {
    opts.interval = +interval
  }
  if (byweekday) {
    opts.byweekday = byweekday.split(',').map(x => rruleDays[+x])
  }
  if (bymonth) {
    opts.bymonth = bymonth.split(',').map(x => +x)
  }

  if (end === 'endDate') {
    opts.until = until
  } else {
    if (count && count > 0) {
      opts.count = +count
    }
  }

  return new RRule(opts)
}
