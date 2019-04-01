import { TextFieldProps } from '@ag/core'
import { Form, Icon, Input } from 'antd'
import debug from 'debug'
import { useField } from 'formik'
import React, { useCallback, useState } from 'react'
import { mapIconName } from './ImageSourceIcon'

const log = debug('TextField.antd')

type Password = import('antd/lib/input/Password').default
type TextArea = import('antd/lib/input/TextArea').default

type InputRefType = Input & Password & TextArea

export const TextField = Object.assign(
  React.memo<TextFieldProps>(props => {
    const {
      field: name,
      label,
      leftIcon,
      rightElement,
      autoFocus,
      placeholder,
      secure,
      rows,
      flex,
      disabled,
      onValueChanged,
    } = props

    const [field, { error }] = useField(name)
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
    const validateStatus = error ? 'error' : undefined
    return (
      <Form.Item
        validateStatus={validateStatus} //
        help={error}
        label={label}
        style={{ flex }}
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
            suffix={rightElement}
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
