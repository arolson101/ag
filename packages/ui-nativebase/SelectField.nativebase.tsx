import { SelectFieldProps } from '@ag/core'
import { Field, FieldProps, FormikProps } from 'formik'
import { Body, Icon, ListItem, Picker } from 'native-base'
import React from 'react'
import { Label } from './Label.nativebase'

export class SelectField<Values> extends React.PureComponent<SelectFieldProps<Values>> {
  private form?: FormikProps<Values>

  render() {
    const { field: name, label, items } = this.props

    return (
      <Field name={name}>
        {({ field, form }: FieldProps<Values>) => {
          this.form = form
          const error = !!(form.touched[name] && form.errors[name])
          const selectedItem = items.find(item => item.value === field.value)
          if (!selectedItem) {
            throw new Error(`selected item ${field.value} not found in item list`)
          }
          return (
            <ListItem button onPress={this.onPress} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Label label={label} error={error} />
              <Body>
                <Picker
                  mode='dialog'
                  iosHeader={label}
                  textStyle={{ flex: 1 }}
                  // placeholder='placeholder'
                  // placeholderStyle={{ flex: 1 }}
                  selectedValue={field.value}
                  onValueChange={this.onValueChange}
                >
                  {items.map(item => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                  ))}
                </Picker>
              </Body>
              {error && <Icon name='close-circle' />}
            </ListItem>
          )
        }}
      </Field>
    )
  }

  onPress = () => {
    // const { navPicker, items, searchable, label, field } = this.props
    // if (searchable) {
    //   navPicker({
    //     title: label,
    //     items,
    //     searchable,
    //     onValueChange: this.onValueChange,
    //     selectedItem: this.form.values[field] as any,
    //   })
    // }
  }

  onValueChange = (value: string) => {
    if (this.form) {
      const { onValueChange, field } = this.props
      this.form.setFieldValue(field, value)
      if (onValueChange) {
        onValueChange(value)
      }
    }
  }
}
