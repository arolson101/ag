import { Account, Bill, Budget } from '@ag/db/entities'
import { toRRule, Validator } from '@ag/util'
import { DateTime } from '@ag/util/date'
import assert from 'assert'
import debug from 'debug'
import { Info } from 'luxon'
import * as R from 'ramda'
import React, { useCallback, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { ByWeekday, RRule, Weekday, WeekdayStr } from 'rrule'
import { useFields } from '../components'
import { SelectFieldItem, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

const log = debug('core:BillForm')

interface Props {
  billId?: string
  onClosed: () => any
}

type Frequency = 'days' | 'weeks' | 'months' | 'years'
type EndType = 'endDate' | 'endCount'

const endTypes: Array<EndType & keyof typeof messages> = ['endDate', 'endCount']
const frequencyTypes: Array<Frequency & keyof typeof messages> = [
  'days',
  'weeks',
  'months',
  'years',
]

interface RRuleValues {
  frequency: Frequency
  start: Date
  end: EndType
  until: string
  count: number
  interval: number
  byweekday: string
  bymonth: string
}

interface FormValues extends RRuleValues {
  name: string
  group: string
  web: string
  notes: string
  amount: number
  account?: string
  category: string
  favicon?: string
  showAdvanced?: boolean
}

export const BillForm = React.memo<Props>(props => {
  const { billId, onClosed } = props
  const intl = useIntl()
  const { Text } = useUi()
  const bills = useSelector(selectors.bills)
  const locale = useSelector(selectors.locale)
  const edit = useSelector(selectors.getBill)(billId)

  const {
    Form,
    AccountField,
    TextField,
    SelectField,
    DateField,
    // CollapseField,
    CheckboxField,
    NumberField,
    UrlField,
    // BudgetField,
  } = useFields<FormValues>()

  const endDate = DateTime.local().plus({ years: 2 })
  const maxGenerated = 200

  const weekdayOptions = useMemo(
    () =>
      Info.weekdays('short', { locale }).map((label, value) => ({
        label,
        value: value.toString(),
      })),
    [locale]
  )

  const monthOptions = useMemo(
    () =>
      Info.months('short', { locale }).map((label, value) => ({
        label,
        value: (value + 1).toString(),
      })),
    [locale]
  )

  const groups = useMemo(() => getGroupNames(bills), [bills])

  let initialValues: FormValues
  if (edit) {
    const rrule = RRule.fromString(edit.rruleString)
    initialValues = {
      ...edit,
      // amount: intl.formatNumber(edit.amount, { style: 'currency', currency: 'USD' }),
      start: rrule.options.dtstart, // DateTime.fromJSDate(rrule.options.dtstart).toLocaleString(),
    } as any

    const opts = rrule.origOptions
    if (opts.freq === RRule.MONTHLY) {
      initialValues.frequency = 'months'
    } else if (opts.freq === RRule.WEEKLY) {
      initialValues.frequency = 'weeks'
    } else if (opts.freq === RRule.MONTHLY) {
      initialValues.frequency = 'months'
    } else if (opts.freq === RRule.YEARLY) {
      initialValues.frequency = 'years'
    }

    if (opts.interval) {
      initialValues.interval = opts.interval
    }
    if (Array.isArray(opts.byweekday)) {
      initialValues.byweekday = opts.byweekday.map(toWeekdayStr).join(',')
      initialValues.showAdvanced = true
    }
    if (Array.isArray(opts.bymonth)) {
      initialValues.bymonth = opts.bymonth.join(',')
      initialValues.showAdvanced = true
    }

    initialValues.end = 'endCount'
    if (opts.until) {
      initialValues.until = DateTime.fromJSDate(opts.until).toLocaleString()
      initialValues.count = 0
      initialValues.end = 'endDate'
    } else if (typeof opts.count === 'number') {
      initialValues.count = opts.count
      initialValues.until = ''
    }
  } else {
    initialValues = {
      ...Bill.defaultValues,
      start: DateTime.local().toJSDate(),
      frequency: 'months',
      interval: 1,
      end: 'endCount',
      until: '',
      count: 1,
      byweekday: '',
      bymonth: '',
    }
  }

  const validate = useCallback(
    (values: FormValues) => {
      const v = new Validator(values, intl.formatMessage)
      const otherNames = bills
        .filter(otherBill => !edit || otherBill.id !== edit.id)
        .map(acct => acct.name)
      v.unique('name', otherNames, messages.uniqueName)
      v.date('start')
      v.date('until')
      v.numeral('amount')
      return v.errors
    },
    [bills]
  )

  const submit = useCallback(
    async values => {
      // try {
      //   const v = new Validator(values, intl.formatMessage)
      //   v.required('name')
      //   v.maybeThrowSubmissionError()
      //   await saveBill({ edit: edit && edit.doc, formatMessage, values })
      //   return onHide()
      // } catch (err) {
      //   Validator.setErrors(err, state, instance)
      // }
    },
    [edit]
  )

  return (
    <Form initialValues={initialValues} validate={validate} submit={submit}>
      {api => {
        const { start, end, interval } = api.values
        assert(end)
        const rrule = rruleSelector(api.values)
        const generatedValues = rrule
          ? rrule.all((date, index) => +endDate > +date && index < maxGenerated)
          : []
        const text = rrule ? rrule.toText() : ''

        const endTypeItems = endTypes.map(et => ({
          value: et,
          label: intl.formatMessage(messages[et], { interval: interval.toString() }),
        }))
        const frequencyTypeItems = frequencyTypes.map(ft => ({
          value: ft,
          label: intl.formatMessage(messages[ft], { interval: interval.toString() }),
        }))

        const onFrequencyChange = (eventKey: any) => {
          api.change('frequency', eventKey as Frequency)
        }
        const filterEndDate = (date: Date): boolean => {
          if (start) {
            return start < date
          }
          return false
        }

        return (
          <>
            <TextField autoFocus field='name' label={intl.formatMessage(messages.name)} />
            <SelectField
              // createable
              field='group'
              items={groups}
              label={intl.formatMessage(messages.group)}
              // promptTextCreator={(label: string) => 'create group ' + label}
              // placeholder=''
            />
            <UrlField
              field='web'
              nameField='name'
              favicoField='favicon'
              favicoHeight={Bill.iconSize}
              favicoWidth={Bill.iconSize}
              label={intl.formatMessage(messages.web)}
            />
            <TextField field='notes' label={intl.formatMessage(messages.notes)} />

            <hr />
            <TextField field='amount' label={intl.formatMessage(messages.amount)} />
            <AccountField field='account' label={intl.formatMessage(messages.account)} />
            {/* <BudgetField field='category' label={intl.formatMessage(messages.budget)} /> */}

            <hr />
            <p>
              <em>{intl.formatMessage(messages.frequencyHeader, { rule: text })}</em>
            </p>
            <DateField
              field='start'
              label={intl.formatMessage(messages.start)}
              highlightDates={generatedValues}
            />
            {end === 'endDate' ? (
              <DateField
                field='until'
                label={intl.formatMessage(messages.end)}
                leftElement={<SelectField field='end' label='' items={endTypeItems} />}
                // placeholder={intl.formatMessage(messages.endDatePlaceholder)}
                // filterDate={filterEndDate}
              />
            ) : (
              <NumberField
                field='count'
                min={0}
                label={intl.formatMessage(messages.end)}
                leftElement={<SelectField field='end' label='' items={endTypeItems} />}
                rightElement={intl.formatMessage(messages.times)}
              />
            )}

            <NumberField
              field='interval'
              label={intl.formatMessage(messages.interval)}
              min={0}
              leftElement={intl.formatMessage(messages.every)}
              rightElement={<SelectField label='' field='frequency' items={frequencyTypeItems} />}
            />

            <CheckboxField
              field='showAdvanced'
              label={intl.formatMessage(messages.advanced)}
              // message={messages.advancedMessage}
            />
            {/* <CollapseField field='showAdvanced'>
                <div>
                  <SelectField
                    field='byweekday'
                    label={intl.formatMessage(messages.byweekday)}
                    multi
                    joinValues
                    delimiter=','
                    simpleValue
                    options={weekdayOptions}
                  />

                  <SelectField
                    field='bymonth'
                    label={intl.formatMessage(messages.bymonth)}
                    multi
                    joinValues
                    delimiter=','
                    simpleValue
                    options={monthOptions}
                  />
                </div>
              </CollapseField> */}

            {/*__DEVELOPMENT__ &&
              <div>{rrule ? rrule.toString() : ''}</div>
            */}
            {rrule &&
              rrule.origOptions.dtstart &&
              generatedValues.length > 0 &&
              !DateTime.fromJSDate(rrule.origOptions.dtstart).equals(
                DateTime.fromJSDate(generatedValues[0])
              ) && <Text /*danger*/>{intl.formatMessage(messages.startExcluded)}</Text>}
          </>
        )
      }}
    </Form>
  )
})

const dayMap: Record<WeekdayStr, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
}

const toWeekdayStr = (weekday: ByWeekday): number => {
  if (typeof weekday === 'number') {
    return weekday
  }
  if (weekday instanceof Weekday) {
    return weekday.getJsWeekday()
  } else {
    return dayMap[weekday]
  }
}

const getGroupNames = R.pipe(
  R.map((bill: Bill): string => bill.group),
  R.uniq,
  R.sortBy(R.toLower),
  R.map((group: string): SelectFieldItem => ({ label: group, value: group }))
)

const rruleSelector = (values: FormValues): RRule | undefined => {
  const { frequency, start, end, until, count, interval, byweekday, bymonth } = values
  try {
    return toRRule({ frequency, start, end, until, count, interval, byweekday, bymonth })
  } catch (error) {
    return undefined
  }
}

const messages = defineMessages({
  group: {
    id: 'BillForm.group',
    defaultMessage: 'Group',
  },
  infoHeader: {
    id: 'BillForm.infoHeader',
    defaultMessage: 'Info',
  },
  name: {
    id: 'BillForm.name',
    defaultMessage: 'Name',
  },
  start: {
    id: 'BillForm.start',
    defaultMessage: 'Start',
  },
  notes: {
    id: 'BillForm.notes',
    defaultMessage: 'Notes',
  },
  web: {
    id: 'BillForm.web',
    defaultMessage: 'Website',
  },
  amountHeader: {
    id: 'BillForm.amountHeader',
    defaultMessage: 'Amount',
  },
  amount: {
    id: 'BillForm.amount',
    defaultMessage: 'Amount',
  },
  account: {
    id: 'BillForm.account',
    defaultMessage: 'Account',
  },
  budget: {
    id: 'BillForm.budget',
    defaultMessage: 'Budget',
  },
  uniqueName: {
    id: 'BillForm.uniqueName',
    defaultMessage: 'This name is already used',
  },
  advanced: {
    id: 'BillForm.advanced',
    defaultMessage: 'Advanced',
  },
  advancedMessage: {
    id: 'BillForm.advancedMessage',
    defaultMessage: 'Advanced options',
  },
  frequencyHeader: {
    id: 'BillForm.frequencyHeader',
    defaultMessage: 'Frequency: {rule}',
  },
  every: {
    id: 'BillForm.every',
    defaultMessage: 'Every',
  },
  days: {
    id: 'BillForm.days',
    defaultMessage: `{interval, plural,
      one {day}
      other {days}
    }`,
  },
  interval: {
    id: 'BillForm.interval',
    defaultMessage: 'Interval',
  },
  weeks: {
    id: 'BillForm.weeks',
    defaultMessage: `{interval, plural,
      one {week}
      other {weeks}
    }`,
  },
  months: {
    id: 'BillForm.months',
    defaultMessage: `{interval, plural,
      one {month}
      other {months}
    }`,
  },
  years: {
    id: 'BillForm.years',
    defaultMessage: `{interval, plural,
      one {year}
      other {years}
    }`,
  },
  end: {
    id: 'BillForm.end',
    defaultMessage: 'End',
  },
  byweekday: {
    id: 'BillForm.byweekday',
    defaultMessage: 'Days of week',
  },
  bymonth: {
    id: 'BillForm.bymonth',
    defaultMessage: 'Months',
  },
  endCount: {
    id: 'BillForm.endCount',
    defaultMessage: 'After',
  },
  endDate: {
    id: 'BillForm.endDate',
    defaultMessage: 'By date',
  },
  endDatePlaceholder: {
    id: 'BillForm.endDatePlaceholder',
    defaultMessage: 'End date',
  },
  times: {
    id: 'BillForm.times',
    defaultMessage: 'times',
  },
  startExcluded: {
    id: 'BillForm.startExcluded',
    defaultMessage: 'Note: The specified start date does not fit in the specified rules',
  },
})
