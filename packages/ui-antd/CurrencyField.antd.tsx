import { CurrencyFieldProps, useIntl } from '@ag/core/context'
import { formatCurrency, useField, useForm } from '@ag/util'
import { Form, Input } from 'antd'
import React, { useCallback, useMemo } from 'react'
import { formItemLayout } from './Form.antd'

export const CurrencyField = Object.assign(
  React.memo<CurrencyFieldProps>(function _CurrencyField(props) {
    const { field: name, label, placeholder, flex, disabled, currencyCode } = props
    const intl = useIntl()
    const [field, { error, touched }] = useField<number>(name)
    const form = useForm()

    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
        if (value === '.') {
          form.change(name, '0.')
        } else if ((!Number.isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
          form.change(name, value)
        }
      },
      [form]
    )

    const onFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
    }, [])

    const onBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value.charAt(value.length - 1) === '.' || value === '-') {
          form.change(name, value.slice(0, -1))
        }
        if (field.onBlur) {
          field.onBlur(e)
        }
      },
      [form, intl, currencyCode]
    )

    const [prefix, suffix] = useMemo(() => {
      const str = formatCurrency(intl, 0, currencyCode)
      const pieces = str.split('0')
      return [pieces[0], pieces[pieces.length - 1]]
    }, [intl, currencyCode])

    return (
      <Form.Item
        validateStatus={touched && error ? 'error' : undefined}
        help={touched && error}
        label={label}
        style={{ flex }}
        {...formItemLayout}
      >
        <Input
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          addonBefore={prefix}
          addonAfter={suffix}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'CurrencyField',
  }
)
