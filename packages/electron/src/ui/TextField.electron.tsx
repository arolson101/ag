import { TextFieldProps } from '@ag/app'
import { FormGroup, InputGroup, Intent, TextArea } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

type InputRefType = HTMLTextAreaElement | HTMLInputElement | null

export class TextField extends React.PureComponent<TextFieldProps> {
  private textInput: InputRefType = null

  focusTextInput = () => {
    if (this.textInput) {
      this.textInput.focus()
    }
  }

  render() {
    const { field: name, label, disabled, autoFocus, placeholder, secure, rows } = this.props
    const id = name
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          const intent = error ? Intent.DANGER : undefined
          return (
            <FormGroup
              intent={intent}
              helperText={error}
              label={label}
              labelFor={id}
              disabled={disabled}
            >
              {rows && rows > 1 ? (
                <TextArea
                  id={id}
                  intent={intent}
                  placeholder={placeholder}
                  rows={rows}
                  inputRef={this.inputRef}
                  fill
                  disabled={disabled}
                  {...field}
                />
              ) : (
                <InputGroup
                  id={id}
                  type={secure ? 'password' : 'text'}
                  intent={intent}
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                  inputRef={this.inputRef}
                  disabled={disabled}
                  {...field}
                />
              )}
            </FormGroup>
          )
        }}
      </Field>
    )
  }

  inputRef = (ref: InputRefType) => {
    this.textInput = ref
  }
}
