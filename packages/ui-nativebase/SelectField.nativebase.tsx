import { SelectFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import { Body, Icon, ListItem, Picker } from 'native-base'
import React, { useCallback } from 'react'
import { Label } from './Label.nativebase'

export const SelectField = Object.assign(
  React.memo<SelectFieldProps>(function _SelectField(props) {
    const { field: name, label, items } = props

    const form = useForm()
    const [field, { touched, error }] = useField(name)

    const onPress = useCallback(() => {
      // const { navPicker, items, searchable, label, field } = this.props
      // if (searchable) {
      //   navPicker({
      //     title: label,
      //     items,
      //     searchable,
      //     onValueChange: this.onValueChange,
      //     selectedItem: form.values[field] as any,
      //   })
      // }
    }, [])

    const onValueChange = useCallback(
      (value: string) => {
        form.change(name, value)
        if (props.onValueChange) {
          props.onValueChange(value)
        }
      },
      [name, form, props.onValueChange]
    )

    const selectedItem = items.find(item => item.value === (field.value as any))
    if (!selectedItem) {
      throw new Error(`selected item ${field.value} not found in item list`)
    }
    return (
      <ListItem button onPress={onPress} style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Label label={label} error={touched && error} />
        <Body>
          <Picker
            mode='dialog'
            iosHeader={label}
            textStyle={{ flex: 1 }}
            // placeholder='placeholder'
            // placeholderStyle={{ flex: 1 }}
            selectedValue={field.value}
            onValueChange={onValueChange}
          >
            {items.map(item => (
              <Picker.Item key={item.value} label={item.label} value={item.value} />
            ))}
          </Picker>
        </Body>
        {touched && error && <Icon name='close-circle' />}
      </ListItem>
    )
  }),
  { displayName: 'SelectField' }
)
