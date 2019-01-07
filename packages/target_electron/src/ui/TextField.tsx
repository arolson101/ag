import { TextFieldProps } from '@ag/app/context'
import { FormGroup, Intent, TextArea } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class TextField extends React.PureComponent<TextFieldProps> {
  render() {
    const { field: name, label, placeholder, secure, rows } = this.props
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
              {rows && rows > 1 ? (
                <TextArea
                  id={id}
                  className={'pt-input pt-fill' + (error ? ' pt-intent-danger' : '')}
                  placeholder={placeholder && placeholder}
                  onChange={field.onChange}
                  value={field.value}
                  rows={rows}
                />
              ) : (
                <input
                  id={id}
                  className={'pt-input pt-fill' + (error ? ' pt-intent-danger' : '')}
                  type={secure ? 'password' : 'text'}
                  placeholder={placeholder && placeholder}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
