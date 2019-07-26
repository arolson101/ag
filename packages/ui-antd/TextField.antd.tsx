import { TextFieldProps } from '@ag/core/context'
import { useField } from '@ag/util'
import { Form, Icon, Input } from 'antd'
import debug from 'debug'
import React, { useCallback, useState } from 'react'
import { formItemLayout } from './Form.antd'
import { mapIconName } from './mapIconName.antd'

const log = debug('ui-antd:TextField.antd')

export const TextField = Object.assign(
  React.memo<TextFieldProps>(function _TextField(props) {
    const {
      field: name,
      label,
      leftIcon,
      leftElement,
      rightElement,
      autoFocus,
      placeholder,
      secure,
      rows,
      flex,
      disabled,
      onValueChanged,
    } = props

    const [field, { error, touched }] = useField(name)
    const onChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        field.onChange(e)
        const value = e.currentTarget.value
        if (onValueChanged) {
          onValueChanged(value)
        }
      },
      [field, onValueChanged]
    )

    const [lastValue, setLastValue] = useState('')
    if (lastValue !== field.value) {
      // log('value changed %s %s', lastValue, field.value)
      setLastValue(field.value)
      if (onValueChanged) {
        onValueChanged(field.value)
      }
    }

    const Component = secure ? Input.Password : Input
    const validateStatus = touched && error ? 'error' : undefined
    return (
      <Form.Item
        validateStatus={validateStatus} //
        help={touched && error}
        label={label}
        style={{ flex }}
        {...formItemLayout}
      >
        {rows && rows > 1 ? (
          <Input.TextArea
            {...field}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            style={{ flex: 1 }}
            onChange={onChange}
          />
        ) : (
          <Component
            {...field}
            autoFocus={autoFocus}
            placeholder={placeholder}
            disabled={disabled}
            style={{ flex: 1 }}
            prefix={
              leftIcon && <Icon type={mapIconName(leftIcon)} style={{ color: 'rgba(0,0,0,.25)' }} />
            }
            addonBefore={leftElement}
            addonAfter={rightElement}
            onChange={onChange}
          />
        )}
      </Form.Item>
    )
  }),
  {
    displayName: 'TextField',
  }
)
