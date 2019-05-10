import { SelectFieldProps } from '@ag/core/context'
import { Form, Select } from 'antd'
import debug from 'debug'
import { useField, useFormikContext } from 'formik'
import React, { useCallback } from 'react'

const log = debug('ui-antd:SelectField')

export const SelectField = Object.assign(
  React.memo<SelectFieldProps>(function _SelectField(props) {
    const { field: name, label, disabled, items, flex, searchable, onValueChange } = props
    const [field, { error }] = useField(name)
    const formik = useFormikContext<any>()

    const onChange = useCallback(
      (value: string) => {
        formik.setFieldValue(name, value)
        if (onValueChange) {
          onValueChange(value)
        }
      },
      [name]
    )

    // log('render %o', name)
    return (
      <Form.Item
        validateStatus={error ? 'error' : undefined}
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
          onChange={onChange}
        >
          {items.map(item => (
            <Select.Option key={item.value}>{item.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    )
  }),
  {
    displayName: 'Form',
  }
)
