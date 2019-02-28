import { TextFieldProps } from '@ag/core'
import { Classes, FormGroup, InputGroup, Intent, TextArea } from '@blueprintjs/core'
import { Field, FieldProps, FormikProps } from 'formik'
import React from 'react'
import { mapIconName } from './ui.blueprint'

type InputRefType = HTMLTextAreaElement | HTMLInputElement | null

export class TextField extends React.PureComponent<TextFieldProps> {
  private textInput: InputRefType = null
  private form!: FormikProps<any>

  focusTextInput = () => {
    if (this.textInput) {
      this.textInput.focus()
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
    const id = name
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          this.form = form
          const error = form.errors[name]
          const intent = error ? Intent.DANGER : undefined
          return (
            <FormGroup
              intent={intent}
              helperText={error}
              label={label}
              labelFor={id}
              disabled={disabled}
              style={{ flex }}
              contentClassName={Classes.FLEX_EXPANDER}
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
                  style={{ flex: 1 }}
                  {...field}
                  onChange={this.onChange}
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
                  style={{ flex: 1 }}
                  leftIcon={mapIconName(leftIcon)}
                  rightElement={rightElement}
                  {...field}
                  onChange={this.onChange}
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

  onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { field, onValueChanged } = this.props
    const value = e.currentTarget.value
    this.form.setFieldValue(field, value)
    if (onValueChanged) {
      onValueChanged(value)
    }
  }
}
