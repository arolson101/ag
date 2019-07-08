import { DateFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import { DatePicker, Form, Icon } from 'antd'
import { DatePickerProps } from 'antd/lib/date-picker/interface'
import debug from 'debug'
import moment from 'moment'
import React, { useCallback, useMemo } from 'react'

const log = debug('antd:DateField')

export const DateField = Object.assign(
  React.memo<DateFieldProps>(function _DateField(props) {
    const { field: name, label, flex, disabled, highlightDates } = props
    const [field, { error, touched }] = useField<any>(name)
    const form = useForm()

    const onChange = useCallback<NonNullable<DatePickerProps['onChange']>>(
      (date, dateString) => {
        form.change(name, date.toDate())
      },
      [form, name]
    )

    const highlightValues = useMemo(
      () =>
        (highlightDates || []).map(date =>
          moment(date)
            .startOf('day')
            .valueOf()
        ),
      [highlightDates]
    )

    const dateRender = useCallback(
      function _dateRender(current: moment.Moment) {
        const style: React.CSSProperties = {}
        const currentValue = current.startOf('day').valueOf()
        if (highlightValues.indexOf(currentValue) !== -1) {
          style.border = '1px solid #1890ff'
          style.borderRadius = '50%'
        }
        return (
          <div className='ant-calendar-date' style={style}>
            {current.date()}
          </div>
        )
      },
      [highlightValues]
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
          dateRender={dateRender}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'DateField',
  }
)
