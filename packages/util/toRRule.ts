import luxon from 'luxon'
import moment from 'moment'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Frequency as RRuleFrequency, Options as RRuleOptions, RRule } from 'rrule'

const messages = defineMessages({
  invalidStartDate: {
    id: 'toRRule.invalidStartDate',
    defaultMessage: 'Invalid start date',
  },
  invalidUntilDate: {
    id: 'toRRule.invalidUntilDate',
    defaultMessage: 'Invalid end date',
  },
})

export class RRuleErrorMessage {
  constructor(
    public field: keyof Params,
    public formattedMessage: FormattedMessage.MessageDescriptor
  ) {}
}

type Frequency = 'days' | 'weeks' | 'months' | 'years'
type EndType = 'endDate' | 'endCount'

interface Params {
  frequency: Frequency
  start?: Date
  end?: EndType
  until?: string
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
    const untilDate = moment(until, 'L')
    if (!untilDate.isValid()) {
      throw new RRuleErrorMessage('until', messages.invalidUntilDate)
    }
    opts.until = untilDate.toDate()
  } else {
    if (count && count > 0) {
      opts.count = +count
    }
  }

  return new RRule(opts)
}
