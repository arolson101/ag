// tslint:disable:max-line-length
import { AccountField, useFields } from '@ag/core/components'
import { ActionItem, useIntl, useUi } from '@ag/core/context'
import { ImageUri } from '@ag/util'
import { action } from '@storybook/addon-actions'
import React, { useCallback, useState } from 'react'
import { MockApp, storiesOf } from './helpers'

interface FormValues {
  text: string
  password: string
  int: number
  float: number
  select: string
  date: Date
  check: boolean
  web: string
  icon: ImageUri
  acctId: string
}

const initialValues: FormValues = {
  text: 'text',
  password: 'asdf',
  int: 2,
  float: 2.5,
  select: 'two',
  date: new Date(),
  check: false,
  web: 'www.google.com',
  icon: '',
  acctId: '',
}

const selectValues = [
  { value: '1', label: 'one' },
  { value: '2', label: 'two' },
  { value: '3', label: 'three' },
]

const highlightDates: Date[] = [
  new Date(initialValues.date.getTime() - 7 * 24 * 60 * 60 * 1000),
  new Date(initialValues.date.getTime() + 14 * 24 * 60 * 60 * 1000),
  new Date(initialValues.date.getTime() + 28 * 24 * 60 * 60 * 1000),
]

interface Props {
  disabled?: boolean
}

const TestForm: React.FC<Props> = ({ disabled }) => {
  const intl = useIntl()
  const { Text, PopoverButton } = useUi()
  const [selection, setSelection] = useState(0)

  const {
    Form,
    TextField,
    UrlField,
    SelectField,
    DateField,
    NumberField,
    // CollapseField,
    CheckboxField,
    // AccountField,
    // BudgetField,
  } = useFields<FormValues>()

  const validate = useCallback((values: FormValues) => {
    return {}
  }, [])

  const submit = action('submit') as any

  const prefixes: ActionItem[] = [
    { text: 'item 0', onClick: () => setSelection(0) },
    { text: 'item 1', onClick: () => setSelection(1) },
    { text: 'item 2', onClick: () => setSelection(2) },
  ]

  return (
    <Form initialValues={initialValues} validate={validate} submit={submit}>
      {() => {
        return (
          <>
            <TextField
              label='text field'
              field='text'
              disabled={disabled}
              leftElement={
                <PopoverButton content={prefixes}>{prefixes[selection].text}</PopoverButton>
              }
              rightElement={<Text>right element</Text>}
            />
            <TextField label='password field' field='password' secure disabled={disabled} />
            <NumberField
              label='integer field (step 2)'
              field='int'
              disabled={disabled}
              min={1}
              max={100}
              step={2}
              integer
            />
            <NumberField
              label='float field (step 1.1)'
              field='float'
              disabled={disabled}
              min={1}
              max={100}
              step={1.1}
            />
            <SelectField
              label='select field'
              field='select'
              items={selectValues}
              disabled={disabled}
            />
            <DateField
              label='date field'
              field='date'
              disabled={disabled}
              highlightDates={highlightDates}
            />
            <CheckboxField label='checkbox field' field='check' disabled={disabled} />
            <UrlField
              label='url field'
              field='web'
              nameField='text'
              favicoField='icon'
              favicoWidth={100}
              favicoHeight={100}
              disabled={disabled}
            />
            <AccountField label='account field' field='acctId' disabled={disabled} />
          </>
        )
      }}
    </Form>
  )
}

storiesOf('Forms/test', module) //
  .add('normal', () => (
    <MockApp dataset='normal'>
      <TestForm />
    </MockApp>
  ))
  .add('disabled', () => (
    <MockApp dataset='normal'>
      <TestForm disabled={true} />
    </MockApp>
  ))
