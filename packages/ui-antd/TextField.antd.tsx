import { TextFieldProps } from '@ag/core'
import { Form, Icon, Input } from 'antd'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'

type InputRefType = Input &
  import('antd/lib/input/Password').default &
  import('antd/lib/input/TextArea').default

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
              ) : secure ? (
                <Input.Password
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                  ref={this.textInput}
                  disabled={disabled}
                  style={{ flex: 1 }}
                  prefix={<Icon type={leftIcon} style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={rightElement}
                  {...field}
                  onChange={this.onChange}
                />
              ) : (
                <Input
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                  ref={this.textInput}
                  disabled={disabled}
                  style={{ flex: 1 }}
                  prefix={<Icon type={leftIcon} style={{ color: 'rgba(0,0,0,.25)' }} />}
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
