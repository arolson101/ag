import { Validator } from '@ag/util'
// import { DateTime } from '@ag/util/date'
// import assert from 'assert'
// import { RRuleErrorMessage, saveBill, toRRule } from 'core/actions'
// import { Account, Bill, Budget } from 'core/docs'
// import { selectBills, selectBudgets } from 'core/selectors'
// import debug from 'debug'
// import { Info } from 'luxon'
// import React, { useCallback } from 'react'
// import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
// import { connect, useSelector } from 'react-redux'
// import { compose, onlyUpdateForPropTypes, setDisplayName, setPropTypes, withState } from 'recompose'
// import { createSelector } from 'reselect'
// import { RRule, WeekdayStr } from 'rrule'
// import { UrlField } from '../components'
// import { SelectFieldItem, typedFields, useIntl, useUi } from '../context'
// import { selectors } from '../reducers'

// const log = debug('core:BillForm')

// interface Props {
//   billId?: string
//   onClosed: () => any
// }

// interface StateProps {
//   monthOptions: SelectFieldItem[]
//   weekdayOptions: SelectFieldItem[]
//   bills: Bill.View[]
//   budgets: Budget.View[]
// }

// interface DispatchProps {
//   saveBill: saveBill.Fcn
// }

// interface ConnectedFormProps {
//   start: Date
//   interval: number
//   count: number
//   frequency: Frequency
//   end: EndType
//   rrule?: RRule
// }

// interface State {
//   groups: SelectFieldItem[]
//   setGroups: (groups: SelectFieldItem[]) => void
// }

// type Frequency = 'days' | 'weeks' | 'months' | 'years'
// type EndType = 'endDate' | 'endCount'

// interface RRuleValues {
//   frequency: Frequency
//   start: string
//   end: EndType
//   until: string
//   count: number
//   interval: number
//   byweekday: string
//   bymonth: string
// }

// interface FormValues extends RRuleValues {
//   name: string
//   group: string
//   web: string
//   notes: string
//   amount: string
//   account?: Account.DocId
//   category: string
//   favicon?: string
//   showAdvanced?: boolean
// }

// export const BillForm = React.memo<Props>(props => {
//   const { billId, onClosed } = props
//   const { edit, groups, monthOptions, weekdayOptions, onHide } = props
//   const intl = useIntl()
//   const bills = useSelector(selectors.getBills)

//   const {
//     Form,
//     TextField,
//     // UrlField,
//     SelectField,
//     DateField,
//     // CollapseField,
//     CheckboxField,
//     // AccountField,
//     // BudgetField,
//   } = typedFields<FormValues>(useUi())

//   const endDate = DateTime.local().plus({ years: 2 })
//   const maxGenerated = 200

//   let defaultValues: Partial<FormValues>
//   if (edit) {
//     const rrule = edit.rrule
//     defaultValues = {
//       ...(edit.doc as any),
//       amount: intl.formatNumber(edit.doc.amount, { style: 'currency', currency: 'USD' }),
//       start: DateTime.local(rrule.options.dtstart).toLocaleString(),
//     }

//     const opts = rrule.origOptions
//     if (opts.freq === RRule.MONTHLY) {
//       defaultValues.frequency = 'months'
//     } else if (opts.freq === RRule.WEEKLY) {
//       defaultValues.frequency = 'weeks'
//     } else if (opts.freq === RRule.MONTHLY) {
//       defaultValues.frequency = 'months'
//     } else if (opts.freq === RRule.YEARLY) {
//       defaultValues.frequency = 'years'
//     }

//     if (opts.interval) {
//       defaultValues.interval = opts.interval
//     }
//     if (Array.isArray(opts.byweekday)) {
//       defaultValues.byweekday = opts.byweekday.map((str: WeekdayStr) => dayMap[str]).join(',')
//       defaultValues.showAdvanced = true
//     }
//     if (Array.isArray(opts.bymonth)) {
//       defaultValues.bymonth = opts.bymonth.join(',')
//       defaultValues.showAdvanced = true
//     }

//     defaultValues.end = 'endCount'
//     if (opts.until) {
//       defaultValues.until = DateTime.local(opts.until).toLocaleString()
//       defaultValues.count = 0
//       defaultValues.end = 'endDate'
//     } else if (typeof opts.count === 'number') {
//       defaultValues.count = opts.count
//       defaultValues.until = ''
//     }
//   } else {
//     defaultValues = {
//       start: DateTime.local().toLocaleString(),
//       frequency: 'months',
//       interval: 1,
//       end: 'endCount',
//     }
//   }

//   const validate = useCallback(
//     (values: FormValues) => {
//       const v = new Validator(values, intl.formatMessage)
//       const otherNames = bills
//         .filter(otherBill => !edit || otherBill.id !== edit.id)
//         .map(acct => acct.name)
//       v.unique('name', otherNames, messages.uniqueName)
//       v.date('start')
//       v.date('until')
//       v.numeral('amount')
//       return v.errors
//     },
//     [bills]
//   )

//   const submit = useCallback(
//     async values => {
//       try {
//         const v = new Validator(values, intl.formatMessage)
//         v.required('name')
//         v.maybeThrowSubmissionError()

//         await saveBill({ edit: edit && edit.doc, formatMessage, values })
//         return onHide()
//       } catch (err) {
//         Validator.setErrors(err, state, instance)
//       }
//     },
//     [edit]
//   )

//   return (
//     <Form defaultValues={defaultValues} validate={validate} submit={submit}>
//       {api => {
//         const { start, interval, frequency, end } = api.values
//         assert(end)
//         const rrule = rruleSelector(api.values)
//         const generatedValues = rrule
//           ? rrule.all((date, index) => +endDate > +date && index < maxGenerated)
//           : []
//         const text = rrule ? rrule.toText() : ''

//         const onFrequencyChange = (eventKey: any) => {
//           api.change('frequency', eventKey as Frequency)
//         }
//         const onEndTypeChange = (eventKey: any) => {
//           api.change('end', eventKey as EndType)
//         }
//         const filterEndDate = (date: Date): boolean => {
//           if (start) {
//             return +DateTime.fromISO(start) < +date
//           }
//           return false
//         }

//         return (
//           <>
//             <TextField autoFocus field='name' label={intl.formatMessage(messages.name)} />
//             <SelectField
//               // createable
//               field='group'
//               items={groups}
//               label={intl.formatMessage(messages.group)}
//               // promptTextCreator={(label: string) => 'create group ' + label}
//               // placeholder=''
//             />
//             <UrlField field='web' favicoField='favicon' label={intl.formatMessage(messages.web)} />
//             <TextField field='notes' label={intl.formatMessage(messages.notes)} />

//             <hr />
//             <TextField field='amount' label={intl.formatMessage(messages.amount)} />
//             <AccountField field='account' label={intl.formatMessage(messages.account)} />
//             <BudgetField field='category' label={intl.formatMessage(messages.budget)} />

//             <hr />
//             <p>
//               <em>
//                 <FormattedMessage {...messages.frequencyHeader} values={{ rule: text }} />
//               </em>
//             </p>
//             <DateField
//               field='start'
//               label={intl.formatMessage(messages.start)}
//               highlightDates={generatedValues}
//             />
//             {end !== 'endDate' && (
//               <TextField
//                 field='count'
//                 type='number'
//                 min={0}
//                 label={intl.formatMessage(messages.end)}
//                 addonBefore={
//                   <DropdownButton
//                     componentClass={InputGroup.Button}
//                     id='count-addon-end'
//                     title={intl.formatMessage(messages[end])}
//                   >
//                     {['endCount', 'endDate'].map((et: EndType) => (
//                       <MenuItem
//                         key={et}
//                         eventKey={et}
//                         onSelect={onEndTypeChange}
//                         active={end === et}
//                       >
//                         <FormattedMessage
//                           {...messages[et]}
//                           values={{ interval: interval.toString() }}
//                         />
//                       </MenuItem>
//                     ))}
//                   </DropdownButton>
//                 }
//                 addonAfter={
//                   <InputGroup.Addon>
//                     <FormattedMessage {...messages.times} />
//                   </InputGroup.Addon>
//                 }
//               />
//             )}
//             {end === 'endDate' && (
//               <DateField
//                 field='until'
//                 label={intl.formatMessage(messages.end)}
//                 addonBefore={
//                   <DropdownButton
//                     componentClass={InputGroup.Button}
//                     id='count-addon-end'
//                     title={intl.formatMessage(messages[end])}
//                   >
//                     {['endCount', 'endDate'].map((et: EndType) => (
//                       <MenuItem
//                         key={et}
//                         eventKey={et}
//                         onSelect={onEndTypeChange}
//                         active={end === et}
//                       >
//                         <FormattedMessage
//                           {...messages[et]}
//                           values={{ interval: interval.toString() }}
//                         />
//                       </MenuItem>
//                     ))}
//                   </DropdownButton>
//                 }
//                 placeholderText={intl.formatMessage(messages.endDatePlaceholder)}
//                 filterDate={filterEndDate}
//               />
//             )}
//             <TextField
//               field='interval'
//               label={intl.formatMessage(messages.interval)}
//               type='number'
//               min={0}
//               addonBefore={
//                 <InputGroup.Addon>
//                   <FormattedMessage {...messages.every} />
//                 </InputGroup.Addon>
//               }
//               addonAfter={
//                 <DropdownButton
//                   pullRight
//                   componentClass={InputGroup.Button}
//                   id='interval-addon-frequency'
//                   title={intl.formatMessage(messages[frequency], {
//                     interval: interval.toString(),
//                   })}
//                 >
//                   {['days', 'weeks', 'months', 'years'].map((cf: Frequency) => (
//                     <MenuItem
//                       key={cf}
//                       eventKey={cf}
//                       onSelect={onFrequencyChange}
//                       active={frequency === cf}
//                     >
//                       <FormattedMessage
//                         {...messages[cf]}
//                         values={{ interval: interval.toString() }}
//                       />
//                     </MenuItem>
//                   ))}
//                 </DropdownButton>
//               }
//             />

//             <CheckboxField
//               field='showAdvanced'
//               label={intl.formatMessage(messages.advanced)}
//               message={messages.advancedMessage}
//             />
//             {/* <CollapseField field='showAdvanced'>
//                 <div>
//                   <SelectField
//                     field='byweekday'
//                     label={intl.formatMessage(messages.byweekday)}
//                     multi
//                     joinValues
//                     delimiter=','
//                     simpleValue
//                     options={weekdayOptions}
//                   />

//                   <SelectField
//                     field='bymonth'
//                     label={intl.formatMessage(messages.bymonth)}
//                     multi
//                     joinValues
//                     delimiter=','
//                     simpleValue
//                     options={monthOptions}
//                   />
//                 </div>
//               </CollapseField> */}

//             {/*__DEVELOPMENT__ &&
//               <div>{rrule ? rrule.toString() : ''}</div>
//             */}
//             {rrule &&
//               rrule.origOptions.dtstart &&
//               generatedValues.length > 0 &&
//               !DateTime.fromJSDate(rrule.origOptions.dtstart).equals(
//                 DateTime.fromJSDate(generatedValues[0])
//               ) && (
//                 <Text danger>
//                   <FormattedMessage {...messages.startExcluded} />
//                 </Text>
//               )}
//           </>
//         )
//       }}
//     </Form>
//   )
// })

// const dayMap = {
//   SU: 0,
//   MO: 1,
//   TU: 2,
//   WE: 3,
//   TH: 4,
//   FR: 5,
//   SA: 6,
// } as { [key: string]: number }

// const weekdayOptions = createSelector(
//   (state: AppState) => state.i18n.locale,
//   (locale: string): SelectFieldItem[] => {
//     const localeData = moment.localeData(locale)
//     const names = localeData.weekdaysShort() // Sunday = 0
//     const first = localeData.firstDayOfWeek()
//     const values = R.range(first, first + 7).map((i: number) => i % 7)
//     return values.map(i => ({
//       value: i.toString(),
//       label: names[i],
//     }))
//   }
// )

// const monthOptions = createSelector(
//   (state: AppState) => state.i18n.locale,
//   (locale: string): SelectFieldItem[] => {
//     const localeData = moment.localeData(locale)
//     const names = localeData.monthsShort()
//     const values = R.range(0, 12)
//     return values.map(i => ({
//       value: (i + 1).toString(), // Jan = 1
//       label: names[i],
//     }))
//   }
// )

// const getGroupNames = R.pipe(
//   R.map((bill: Bill.View): string => bill.doc.group),
//   R.sortBy(R.toLower),
//   R.uniq,
//   R.map((name: string): SelectFieldItem => ({ label: name, value: name }))
// )

// const rruleSelector = (values: Values): RRule | undefined => {
//   const { frequency, start, end, until, count, interval, byweekday, bymonth } = values
//   const rrule = toRRule({ frequency, start, end, until, count, interval, byweekday, bymonth })
//   if (rrule instanceof RRuleErrorMessage) {
//     return undefined
//   }
//   return rrule
// }

// const messages = defineMessages({
//   group: {
//     id: 'BillForm.group',
//     defaultMessage: 'Group',
//   },
//   infoHeader: {
//     id: 'BillForm.infoHeader',
//     defaultMessage: 'Info',
//   },
//   name: {
//     id: 'BillForm.name',
//     defaultMessage: 'Name',
//   },
//   start: {
//     id: 'BillForm.start',
//     defaultMessage: 'Start',
//   },
//   notes: {
//     id: 'BillForm.notes',
//     defaultMessage: 'Notes',
//   },
//   web: {
//     id: 'BillForm.web',
//     defaultMessage: 'Website',
//   },
//   amountHeader: {
//     id: 'BillForm.amountHeader',
//     defaultMessage: 'Amount',
//   },
//   amount: {
//     id: 'BillForm.amount',
//     defaultMessage: 'Amount',
//   },
//   account: {
//     id: 'BillForm.account',
//     defaultMessage: 'Account',
//   },
//   budget: {
//     id: 'BillForm.budget',
//     defaultMessage: 'Budget',
//   },
//   uniqueName: {
//     id: 'BillForm.uniqueName',
//     defaultMessage: 'This name is already used',
//   },
//   advanced: {
//     id: 'BillForm.advanced',
//     defaultMessage: 'Advanced',
//   },
//   advancedMessage: {
//     id: 'BillForm.advancedMessage',
//     defaultMessage: 'Advanced options',
//   },
//   frequencyHeader: {
//     id: 'BillForm.frequencyHeader',
//     defaultMessage: 'Frequency: {rule}',
//   },
//   every: {
//     id: 'BillForm.every',
//     defaultMessage: 'Every',
//   },
//   days: {
//     id: 'BillForm.days',
//     defaultMessage: `{interval, plural,
//       one {day}
//       other {days}
//     }`,
//   },
//   interval: {
//     id: 'BillForm.interval',
//     defaultMessage: 'Interval',
//   },
//   weeks: {
//     id: 'BillForm.weeks',
//     defaultMessage: `{interval, plural,
//       one {week}
//       other {weeks}
//     }`,
//   },
//   months: {
//     id: 'BillForm.months',
//     defaultMessage: `{interval, plural,
//       one {month}
//       other {months}
//     }`,
//   },
//   years: {
//     id: 'BillForm.years',
//     defaultMessage: `{interval, plural,
//       one {year}
//       other {years}
//     }`,
//   },
//   end: {
//     id: 'BillForm.end',
//     defaultMessage: 'End',
//   },
//   byweekday: {
//     id: 'BillForm.byweekday',
//     defaultMessage: 'Days of week',
//   },
//   bymonth: {
//     id: 'BillForm.bymonth',
//     defaultMessage: 'Months',
//   },
//   endCount: {
//     id: 'BillForm.endCount',
//     defaultMessage: 'After',
//   },
//   endDate: {
//     id: 'BillForm.endDate',
//     defaultMessage: 'By date',
//   },
//   endDatePlaceholder: {
//     id: 'BillForm.endDatePlaceholder',
//     defaultMessage: 'End date',
//   },
//   times: {
//     id: 'BillForm.times',
//     defaultMessage: 'times',
//   },
//   startExcluded: {
//     id: 'BillForm.startExcluded',
//     defaultMessage: 'Note: The specified start date does not fit in the specified rules',
//   },
// })
