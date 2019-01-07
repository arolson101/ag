import { UrlFieldProps } from '@ag/app/context'
import { FormGroup, Intent } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class UrlField extends React.PureComponent<UrlFieldProps> {
  private textInput = React.createRef<HTMLInputElement>()

  focusTextInput = () => {
    if (this.textInput.current) {
      this.textInput.current.focus()
    }
  }

  render() {
    const { field: name, autoFocus, label, placeholder } = this.props
    const id = `${name}-input`
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = !!(form.touched[name] && form.errors[name])
          return (
            <FormGroup
              intent={error ? Intent.DANGER : undefined}
              helperText={error}
              label={label}
              labelFor={id}
            >
              <input
                id={id}
                className={'pt-input pt-fill' + (error ? ' pt-intent-danger' : '')}
                type='text'
                autoFocus={autoFocus}
                onChange={field.onChange}
                value={field.value}
                placeholder={placeholder && placeholder}
                ref={this.textInput}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
