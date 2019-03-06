import { TextFieldProps } from '@ag/core'
import { Form, Icon, Input } from 'antd'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { mapIconName } from './ui.antd'

type Password = import('antd/lib/input/Password').default
type TextArea = import('antd/lib/input/TextArea').default

type InputRefType = Input & Password & TextArea

export class TextField extends React.PureComponent<TextFieldProps> {
  private textInput = React.createRef<InputRefType>()
  private form!: FormikProps<any>

  focusTextInput = () => {
    if (this.textInput.current) {
      this.textInput.current.focus()
    }
  }

  render() {
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
    } = this.props
    const Component = secure ? Input.Password : Input
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          this.form = form
          const error = form.errors[name]
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
                  placeholder={placeholder}
                  rows={rows}
                  ref={this.textInput}
                  disabled={disabled}
                  style={{ flex: 1 }}
                  {...field}
                  onChange={this.onChange}
                />
              ) : (
                <Component
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                  ref={this.textInput}
                  disabled={disabled}
                  style={{ flex: 1 }}
                  prefix={
                    leftIcon && (
                      <Icon type={mapIconName(leftIcon)} style={{ color: 'rgba(0,0,0,.25)' }} />
                    )
                  }
                  suffix={rightElement}
                  {...field}
                  onChange={this.onChange}
                />
              )}
            </Form.Item>
          )
        }}
      </Field>
    )
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { field, onValueChanged } = this.props
    const value = e.currentTarget.value
    this.form.setFieldValue(field, value)
    if (onValueChanged) {
      onValueChanged(value)
    }
  }
}
