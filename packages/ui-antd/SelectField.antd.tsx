import { SelectFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import { Form, Select } from 'antd'
import debug from 'debug'
import React, { useCallback } from 'react'
import { formItemLayout } from './Form.antd'

const log = debug('ui-antd:SelectField')

export const SelectField = Object.assign(
  React.memo<SelectFieldProps>(function _SelectField(props) {
    const { field: name, label, disabled, items, flex, searchable, onValueChange } = props
    const [field, { error, touched }] = useField(name)
    const form = useForm()

    const onChange = useCallback(
      (value: string) => {
        form.change(name, value)
        if (onValueChange) {
          onValueChange(value)
        }
      },
      [name]
    )

    // log('render %o', name)

    const select = (
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
    )

    if (label) {
      return (
        <Form.Item
          validateStatus={touched && error ? 'error' : undefined}
          help={touched && error}
          label={label}
          style={{ flex }}
          {...formItemLayout}
        >
          {select}
        </Form.Item>
      )
    } else {
      return select
    }
  }),
  {
    displayName: 'SelectField',
  }
)
