import { DateFieldProps } from '@ag/core'
import { DatePicker, Form, Icon } from 'antd'
import { useField, useFormikContext } from 'formik'
import React, { useCallback } from 'react'

import { DatePickerProps } from 'antd/lib/date-picker/interface'

export const DateField = Object.assign(
  React.memo<DateFieldProps>(props => {
    const { field: name, label, flex, disabled } = props
    const [field, { error }] = useField(name)
    const formik = useFormikContext<any>()

    const onChange = useCallback<NonNullable<DatePickerProps['onChange']>>(
      (date, dateString) => {
        formik.setFieldValue(name, date.toDate())
      },
      [formik, name]
    )

    return (
      <Form.Item
        validateStatus={error ? 'error' : undefined}
        help={error}
        label={label}
        style={{ flex }}
      >
        <DatePicker //
          {...field}
          disabled={disabled}
          style={{ flex: 1 }}
          onChange={onChange}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'DateField',
  }
)
