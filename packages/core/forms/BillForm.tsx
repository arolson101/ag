import { Bill } from '@ag/db/entities'
import { pick, toRRule, useSubmitRef, Validator } from '@ag/util'
import { DateTime } from '@ag/util/date'
import assert from 'assert'
import debug from 'debug'
// import { Info } from 'luxon'
import * as R from 'ramda'
import React, { useCallback, useImperativeHandle, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { ByWeekday, RRule, Weekday, WeekdayStr } from 'rrule'
import { useFields } from '../components'
import { SelectFieldItem, useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:BillForm')

interface Props {
  billId?: string
  onClosed: () => any
}

export interface BillForm {
  save: () => any
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
  until: Date
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

export const BillForm = Object.assign(
  React.forwardRef<BillForm, Props>(function _BillForm(props, ref) {
    const { billId, onClosed } = props
    const intl = useIntl()
    const { Text, Divider } = useUi()
    const bills = useSelector(selectors.bills)
    const locale = useSelector(selectors.locale)
    const edit = useSelector(selectors.getBill)(billId)
    const saveBill = useAction(thunks.saveBill)
    const submitFormRef = useSubmitRef()
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
    const maxGenerated = 20

    // const weekdayOptions = useMemo(
    //   () =>
    //     Info.weekdays('short', { locale }).map((label, value) => ({
    //       label,
    //       value: value.toString(),
    //     })),
    //   [locale]
    // )

    // const monthOptions = useMemo(
    //   () =>
    //     Info.months('short', { locale }).map((label, value) => ({
    //       label,
    //       value: (value + 1).toString(),
    //     })),
    //   [locale]
    // )

    const groups = useMemo(() => getGroupNames(bills.filter(bill => !!bill.group)), [bills])
    log('groups %o bills %o', groups, bills)

    let initialValues: FormValues
    if (edit) {
      const rrule = RRule.fromString(edit.rruleString)
      initialValues = {
        ...edit,
        // amount: intl.formatNumber(edit.amount, { style: 'currency', currency: 'USD' }),
        start: rrule.options.dtstart,
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
        initialValues.until = opts.until
        initialValues.count = 0
        initialValues.end = 'endDate'
      } else if (typeof opts.count === 'number') {
        initialValues.count = opts.count
        initialValues.until = new Date()
      }
    } else {
      initialValues = {
        ...Bill.defaultValues,
        start: DateTime.local().toJSDate(),
        frequency: 'months',
        interval: 1,
        end: 'endCount',
        until: new Date(),
        count: 0,
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
        v.required('name')
        v.unique('name', otherNames, messages.uniqueName)
        v.date('start')
        v.date('until')
        v.numeral('amount')
        return v.errors
      },
      [bills]
    )

    const submit = useCallback(
      async (values: FormValues) => {
        try {
          // log('onSubmit %o', { input, bankId })
          const rrule = toRRule(values)
          const input = {
            ...pick(values, Object.keys(Bill.defaultValues) as Array<keyof Bill.Props>),
            rruleString: rrule.toString(),
          }
          await saveBill({ input, billId })
          onClosed()
        } catch (err) {
          log('caught %o', err)
        }
      },
      [saveBill, onClosed]
    )

    useImperativeHandle(ref, () => ({
      save: () => {
        submitFormRef.current()
      },
    }))

    return (
      <Form
        initialValues={initialValues}
        validate={validate}
        submit={submit}
        submitRef={submitFormRef}
      >
        {api => {
          const { start, end, interval, showAdvanced } = api.values
          assert(end)
          const rrule = toRRule(api.values)
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

          const disableDate = (date: Date): boolean => {
            if (start) {
              return start > date
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

              <Divider />

              <TextField field='amount' label={intl.formatMessage(messages.amount)} />
              <AccountField field='account' label={intl.formatMessage(messages.account)} />
              {/* <BudgetField field='category' label={intl.formatMessage(messages.budget)} /> */}

              <Divider />

              <DateField
                field='start'
                label={intl.formatMessage(messages.start)}
                highlightDates={generatedValues}
              />

              <NumberField
                field='interval'
                label={intl.formatMessage(messages.interval)}
                min={1}
                leftElement={intl.formatMessage(messages.every)}
                rightElement={<SelectField label='' field='frequency' items={frequencyTypeItems} />}
              />

              {end === 'endDate' ? (
                <DateField
                  field='until'
                  label={intl.formatMessage(messages.end)}
                  leftElement={<SelectField field='end' label='' items={endTypeItems} />}
                  // placeholder={intl.formatMessage(messages.endDatePlaceholder)}
                  disabledDate={disableDate}
                  highlightDates={generatedValues}
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

              {/* {showAdvanced && (
              <>
                <CheckboxField
                  field='showAdvanced' //
                  label={intl.formatMessage(messages.advanced)}
                />
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
              </>
            )} */}

              <Text muted>{intl.formatMessage(messages.frequencyHeader, { rule: text })}</Text>
              {/* <Text>{rrule ? rrule.toString() : ''}</Text> */}

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
  }),
  {
    displayName: 'BillForm',
  }
)

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
  // R.filter(val => !!val),
  R.uniq,
  R.sortBy(R.toLower),
  R.map((group: string): SelectFieldItem => ({ label: group, value: group }))
)

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
