import { SelectFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import debug from 'debug'
import { Body, Icon, ListItem, Picker } from 'native-base'
import React, { useCallback } from 'react'
import { Label } from './Label.nativebase'

const log = debug('ui-nativebase:SelectField')

export const SelectField = Object.assign(
  React.memo<SelectFieldProps>(function _SelectField(props) {
    const { field: name, label, items } = props

    const form = useForm()
    const [field, { touched, error }] = useField(name)

    const onValueChange = useCallback(
      (value: string) => {
        form.change(name, value)
        if (props.onValueChange) {
          props.onValueChange(value)
        }
      },
      [name, form, props.onValueChange]
    )

    const picker = (
      <Picker
        mode='dialog'
        iosHeader={label}
        textStyle={{ flex: 1, textAlign: 'right' }}
        // placeholder='placeholder'
        // placeholderStyle={{ flex: 1 }}
        selectedValue={field.value}
        onValueChange={onValueChange}
      >
        {items.map(item => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    )

    if (label) {
      return (
        <ListItem button style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Label label={label} error={touched && error} />
          <Body>{picker}</Body>
          {touched && error && <Icon name='close-circle' />}
        </ListItem>
      )
    } else {
      return picker
    }
  }),
  { displayName: 'SelectField' }
)
