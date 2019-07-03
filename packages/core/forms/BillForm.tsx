import { Validator } from '@ag/util'
import { DateTime } from '@ag/util/date'
import assert from 'assert'
import { RRuleErrorMessage, saveBill, toRRule } from 'core/actions'
import { Account, Bill, Budget } from 'core/docs'
import { selectBills, selectBudgets } from 'core/selectors'
import { AppState, mapDispatchToProps, setDialog } from 'core/state'
import debug from 'debug'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { compose, onlyUpdateForPropTypes, setDisplayName, setPropTypes, withState } from 'recompose'
import { createSelector } from 'reselect'
import { RRule, WeekdayStr } from 'rrule'
import { typedFields, useIntl, useUi } from '../context'

const log = debug('core:BillForm')

interface Props {
  billId?: string
  onClosed: () => any
}

interface StateProps {
  monthOptions: SelectOption[]
  weekdayOptions: SelectOption[]
  bills: Bill.View[]
  budgets: Budget.View[]
}

interface DispatchProps {
  saveBill: saveBill.Fcn
}

interface ConnectedFormProps {
  start: Date
  interval: number
  count: number
  frequency: Frequency
  end: EndType
  rrule?: RRule
}

interface State {
  groups: SelectOption[]
  setGroups: (groups: SelectOption[]) => void
}

type Frequency = 'days' | 'weeks' | 'months' | 'years'
type EndType = 'endDate' | 'endCount'

interface RRuleValues {
  frequency: Frequency
  start: string
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
  amount: string
  account?: Account.DocId
  category: string
  favicon?: string
  showAdvanced?: boolean
}

export const BillFormComponent = React.memo<Props>(props => {
  const { billId, onClosed } = props
  const { edit, groups, monthOptions, weekdayOptions, onHide } = props
  const intl = useIntl()

  const {
    Form,
    TextField,
    // UrlField,
    SelectField,
    DateField,
    // CollapseField,
    CheckboxField,
    // AccountField,
    // BudgetField,
  } = typedFields<FormValues>(useUi())

  const endDate = DateTime.local().plus({ years: 2 })
  const maxGenerated = 200

  let defaultValues: Partial<FormValues>
  if (edit) {
    const rrule = edit.rrule
    defaultValues = {
      ...(edit.doc as any),
      amount: intl.formatNumber(edit.doc.amount, { style: 'currency', currency: 'USD' }),
      start: DateTime.local(rrule.options.dtstart).toLocaleString(),
    }

    const opts = rrule.origOptions
    if (opts.freq === RRule.MONTHLY) {
      defaultValues.frequency = 'months'
    } else if (opts.freq === RRule.WEEKLY) {
      defaultValues.frequency = 'weeks'
    } else if (opts.freq === RRule.MONTHLY) {
      defaultValues.frequency = 'months'
    } else if (opts.freq === RRule.YEARLY) {
      defaultValues.frequency = 'years'
    }

    if (opts.interval) {
      defaultValues.interval = opts.interval
    }
    if (Array.isArray(opts.byweekday)) {
      defaultValues.byweekday = opts.byweekday.map((str: WeekdayStr) => dayMap[str]).join(',')
      defaultValues.showAdvanced = true
    }
    if (Array.isArray(opts.bymonth)) {
      defaultValues.bymonth = opts.bymonth.join(',')
      defaultValues.showAdvanced = true
    }

    defaultValues.end = 'endCount'
    if (opts.until) {
      defaultValues.until = DateTime.local(opts.until).toLocaleString()
      defaultValues.count = 0
      defaultValues.end = 'endDate'
    } else if (typeof opts.count === 'number') {
      defaultValues.count = opts.count
      defaultValues.until = ''
    }
  } else {
    defaultValues = {
      start: DateTime.local().toLocaleString(),
      frequency: 'months',
      interval: 1,
      end: 'endCount',
    }
  }

  const validate = useCallback((values: FormValues) => {
    const { edit, bills } = props
    const v = new Validator(values, intl.formatMessage)
    const otherBills = bills.filter(
      (otherBill: Bill.View) => !edit || otherBill.doc._id !== edit.doc._id
    )
    const otherNames = otherBills.map(acct => acct.doc.name)
    v.unique('name', otherNames, messages.uniqueName)
    v.date('start')
    v.date('until')
    v.numeral('amount')
    return v.errors
  }, [])

  const submit = useCallback(async values => {
    try {
      const {
        edit,
        onHide,
        saveBill,
        intl: { formatMessage },
      } = props
      const v = new Validator(values, intl.formatMessage)
      v.required('name')
      v.maybeThrowSubmissionError()

      await saveBill({ edit: edit && edit.doc, formatMessage, values })
      return onHide()
    } catch (err) {
      Validator.setErrors(err, state, instance)
    }
  }, [])

  return (
    <Form defaultValues={defaultValues} validate={validate} submit={submit}>
      {api => {
        const { start, interval, frequency, end } = api.values
        assert(end)
        const rrule = rruleSelector(api.values)
        const generatedValues = rrule
          ? rrule.all((date, index) => endDate.isAfter(date) && index < maxGenerated)
          : []
        const text = rrule ? rrule.toText() : ''

        const onFrequencyChange: SelectCallback = (eventKey: any) => {
          api.setValue('frequency', eventKey as Frequency)
        }
        const onEndTypeChange: SelectCallback = (eventKey: any) => {
          api.setValue('end', eventKey as EndType)
        }
        const filterEndDate = (date: Date): boolean => {
          if (start) {
            return moment(start, 'L').isBefore(date)
          }
          return false
        }

        return (
          <div>
            <Modal.Body>
              <TextField autoFocus name='name' label={messages.name} />
              <SelectField
                createable
                name='group'
                options={groups}
                label={messages.group}
                promptTextCreator={(label: string) => 'create group ' + label}
                placeholder=''
              />
              <UrlField name='web' favicoName='favicon' label={messages.web} />
              <TextField name='notes' label={messages.notes} />

              <hr />
              <TextField name='amount' label={messages.amount} />
              <AccountField name='account' label={messages.account} />
              <BudgetField name='category' label={messages.budget} />

              <hr />
              <p>
                <em>
                  <FormattedMessage {...messages.frequencyHeader} values={{ rule: text }} />
                </em>
              </p>
              <DateField name='start' label={messages.start} highlightDates={generatedValues} />
              {end !== 'endDate' && (
                <TextField
                  name='count'
                  type='number'
                  min={0}
                  label={messages.end}
                  addonBefore={
                    <DropdownButton
                      componentClass={InputGroup.Button}
                      id='count-addon-end'
                      title={intl.formatMessage(messages[end])}
                    >
                      {['endCount', 'endDate'].map((et: EndType) => (
                        <MenuItem
                          key={et}
                          eventKey={et}
                          onSelect={onEndTypeChange}
                          active={end === et}
                        >
                          <FormattedMessage
                            {...messages[et]}
                            values={{ interval: interval.toString() }}
                          />
                        </MenuItem>
                      ))}
                    </DropdownButton>
                  }
                  addonAfter={
                    <InputGroup.Addon>
                      <FormattedMessage {...messages.times} />
                    </InputGroup.Addon>
                  }
                />
              )}
              {end === 'endDate' && (
                <DateField
                  name='until'
                  label={messages.end}
                  addonBefore={
                    <DropdownButton
                      componentClass={InputGroup.Button}
                      id='count-addon-end'
                      title={intl.formatMessage(messages[end])}
                    >
                      {['endCount', 'endDate'].map((et: EndType) => (
                        <MenuItem
                          key={et}
                          eventKey={et}
                          onSelect={onEndTypeChange}
                          active={end === et}
                        >
                          <FormattedMessage
                            {...messages[et]}
                            values={{ interval: interval.toString() }}
                          />
                        </MenuItem>
                      ))}
                    </DropdownButton>
                  }
                  placeholderText={intl.formatMessage(messages.endDatePlaceholder)}
                  filterDate={filterEndDate}
                />
              )}
              <TextField
                name='interval'
                label={messages.interval}
                type='number'
                min={0}
                addonBefore={
                  <InputGroup.Addon>
                    <FormattedMessage {...messages.every} />
                  </InputGroup.Addon>
                }
                addonAfter={
                  <DropdownButton
                    pullRight
                    componentClass={InputGroup.Button}
                    id='interval-addon-frequency'
                    title={intl.formatMessage(messages[frequency], {
                      interval: interval.toString(),
                    })}
                  >
                    {['days', 'weeks', 'months', 'years'].map((cf: Frequency) => (
                      <MenuItem
                        key={cf}
                        eventKey={cf}
                        onSelect={onFrequencyChange}
                        active={frequency === cf}
                      >
                        <FormattedMessage
                          {...messages[cf]}
                          values={{ interval: interval.toString() }}
                        />
                      </MenuItem>
                    ))}
                  </DropdownButton>
                }
              />

              <CheckboxField
                name='showAdvanced'
                label={messages.advanced}
                message={messages.advancedMessage}
              />
              <CollapseField name='showAdvanced'>
                <div>
                  <SelectField
                    name='byweekday'
                    label={messages.byweekday}
                    multi
                    joinValues
                    delimiter=','
                    simpleValue
                    options={weekdayOptions}
                  />

                  <SelectField
                    name='bymonth'
                    label={messages.bymonth}
                    multi
                    joinValues
                    delimiter=','
                    simpleValue
                    options={monthOptions}
                  />
                </div>
              </CollapseField>

              {/*__DEVELOPMENT__ &&
              <div>{rrule ? rrule.toString() : ''}</div>
            */}
              {rrule &&
                generatedValues.length > 0 &&
                !moment(rrule.origOptions.dtstart).isSame(generatedValues[0]) && (
                  <Alert bsStyle='danger'>
                    <FormattedMessage {...messages.startExcluded} />
                  </Alert>
                )}
            </Modal.Body>
          </div>
        )
      }}
    </Form>
  )
})

export const BillForm = connect<StateProps, DispatchProps, Props>(
  (state: AppState): StateProps => ({
    bills: selectBills(state),
    budgets: selectBudgets(state),
    monthOptions: monthOptions(state),
    weekdayOptions: weekdayOptions(state),
  }),
  mapDispatchToProps<DispatchProps>({ saveBill })
)(BillFormComponent)

const dayMap = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
} as { [key: string]: number }

const weekdayOptions = createSelector(
  (state: AppState) => state.i18n.locale,
  (locale: string): SelectOption[] => {
    const localeData = moment.localeData(locale)
    const names = localeData.weekdaysShort() // Sunday = 0
    const first = localeData.firstDayOfWeek()
    const values = R.range(first, first + 7).map((i: number) => i % 7)
    return values.map(i => ({
      value: i.toString(),
      label: names[i],
    }))
  }
)

const monthOptions = createSelector(
  (state: AppState) => state.i18n.locale,
  (locale: string): SelectOption[] => {
    const localeData = moment.localeData(locale)
    const names = localeData.monthsShort()
    const values = R.range(0, 12)
    return values.map(i => ({
      value: (i + 1).toString(), // Jan = 1
      label: names[i],
    }))
  }
)

const getGroupNames = R.pipe(
  R.map((bill: Bill.View): string => bill.doc.group),
  R.sortBy(R.toLower),
  R.uniq,
  R.map((name: string): SelectOption => ({ label: name, value: name }))
)

const rruleSelector = (values: Values): RRule | undefined => {
  const { frequency, start, end, until, count, interval, byweekday, bymonth } = values
  const rrule = toRRule({ frequency, start, end, until, count, interval, byweekday, bymonth })
  if (rrule instanceof RRuleErrorMessage) {
    return undefined
  }
  return rrule
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
