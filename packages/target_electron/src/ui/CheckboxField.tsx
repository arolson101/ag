import { CheckboxFieldProps } from '@ag/app/context'
import { FormGroup, Intent, Switch } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class CheckboxField extends React.PureComponent<CheckboxFieldProps> {
  render() {
    const { field: name, label } = this.props
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
              <Switch
                className='pt-align-right'
                label={label}
                checked={field.value}
                onChange={e => form.setFieldValue(name, e.currentTarget.checked)}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
