import { DateFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import { DatePicker, Form, Icon } from 'antd'
import { DatePickerProps } from 'antd/lib/date-picker/interface'
import moment from 'moment'
import React, { useCallback } from 'react'

export const DateField = Object.assign(
  React.memo<DateFieldProps>(function _DateField(props) {
    const { field: name, label, flex, disabled } = props
    const [field, { error, touched }] = useField<any>(name)
    const form = useForm()

    const onChange = useCallback<NonNullable<DatePickerProps['onChange']>>(
      (date, dateString) => {
        form.change(name, date.toDate())
      },
      [form, name]
    )

    const value = moment(field.value)

    return (
      <Form.Item
        validateStatus={touched && error ? 'error' : undefined}
        help={touched && error}
        label={label}
        style={{ flex }}
      >
        <DatePicker //
          allowClear={false}
          {...field}
          disabled={disabled}
          style={{ flex: 1 }}
          onChange={onChange}
          value={value}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'DateField',
  }
)
