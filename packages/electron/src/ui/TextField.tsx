import { TextFieldProps } from '@ag/app/context'
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
    const { field: name, label, autoFocus, placeholder, secure, rows } = this.props
    const id = name
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          const intent = error ? Intent.DANGER : undefined
          return (
            <FormGroup intent={intent} helperText={error} label={label} labelFor={id}>
              {rows && rows > 1 ? (
                <TextArea
                  id={id}
                  intent={intent}
                  placeholder={placeholder}
                  onChange={field.onChange}
                  value={field.value}
                  rows={rows}
                  inputRef={this.inputRef}
                  fill
                />
              ) : (
                <InputGroup
                  id={id}
                  type={secure ? 'password' : 'text'}
                  intent={intent}
                  autoFocus={autoFocus}
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={placeholder}
                  inputRef={this.inputRef}
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
