import { SelectFieldProps } from '@ag/core'
import { Form, Select } from 'antd'
import debug from 'debug'
import { Field, FieldProps } from 'formik'
import React from 'react'

const log = debug('ui-antd:SelectField')
log.enabled = true

export class SelectField extends React.Component<SelectFieldProps> {
  render() {
    const { field: name, label, disabled, items, flex, searchable, onValueChange } = this.props
    // log('render %o', name)
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          const validateStatus = error ? 'error' : undefined
          // log('field %s', field.value)
          return (
            <Form.Item
              validateStatus={validateStatus} //
              help={error}
              label={label}
              style={{ flex }}
            >
              <Select<string>
                style={{ flex: 1 }}
                disabled={disabled}
                showSearch={searchable}
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.props
                    .children!.toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                value={field.value || ''}
                onChange={value => {
                  const e: React.ChangeEvent = { target: { value } } as any
                  form.setFieldValue(name, value)
                  if (onValueChange) {
                    onValueChange(value)
                  }
                }}
              >
                {items.map(item => (
                  <Select.Option key={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}
