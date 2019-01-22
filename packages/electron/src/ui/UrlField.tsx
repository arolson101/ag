import { UrlFieldProps } from '@ag/app'
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class UrlField extends React.PureComponent<UrlFieldProps> {
  private textInput: HTMLInputElement | null = null

  focusTextInput = () => {
    if (this.textInput) {
      this.textInput.focus()
    }
  }

  render() {
    const { field: name, autoFocus, label, placeholder } = this.props
    const id = name
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          const intent = error ? Intent.DANGER : undefined
          return (
            <FormGroup intent={intent} helperText={error} label={label} labelFor={id}>
              <InputGroup
                id={id}
                type='text'
                intent={intent}
                autoFocus={autoFocus}
                onChange={field.onChange}
                value={field.value}
                placeholder={placeholder && placeholder}
                inputRef={this.inputRef}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }

  inputRef = (ref: HTMLInputElement | null) => {
    this.textInput = ref
  }
}
