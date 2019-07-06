// tslint:disable:max-line-length
import { AccountField, UrlField } from '@ag/core/components'
import { typedFields, useIntl, useUi } from '@ag/core/context'
import { ImageUri } from '@ag/util'
import { action } from '@storybook/addon-actions'
import React, { useCallback } from 'react'
import { MockApp, storiesOf } from './helpers'

interface FormValues {
  text: string
  select: string
  date: Date
  check: boolean
  web: string
  icon: ImageUri
  acctId: string
}

const initialValues: FormValues = {
  text: '',
  select: 'two',
  date: new Date(),
  check: false,
  web: '',
  icon: '',
  acctId: '',
}

const selectValues = [
  { value: '1', label: 'one' },
  { value: '2', label: 'two' },
  { value: '3', label: 'three' },
]

interface Props {
  disabled?: boolean
}

const TestForm: React.FC<Props> = ({ disabled }) => {
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

  const validate = useCallback((values: FormValues) => {
    return {}
  }, [])

  const submit = action('submit') as any

  return (
    <Form initialValues={initialValues} validate={validate} submit={submit}>
      {() => {
        return (
          <>
            <TextField label='text field' field='text' disabled={disabled} />
            <SelectField
              label='select field'
              field='select'
              items={selectValues}
              disabled={disabled}
            />
            <DateField label='date field' field='date' disabled={disabled} />
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
            <AccountField label='account field' field='acctId' />
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
