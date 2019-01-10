import { SelectFieldItem, SelectFieldProps } from '@ag/app/context'
import { FormGroup, Intent, MenuItem } from '@blueprintjs/core'
import { ItemPredicate, ItemRenderer, Suggest } from '@blueprintjs/select'
import { Field, FieldProps } from 'formik'
import React from 'react'

import '@blueprintjs/select/lib/css/blueprint-select.css'
import './SelectField.css'

const ItemSuggest = Suggest.ofType<SelectFieldItem>()

const filterItem: ItemPredicate<SelectFieldItem> = (query, item) => {
  return item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0
}

const renderItem: ItemRenderer<SelectFieldItem> = (item, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null
  }
  return (
    <MenuItem
      active={modifiers.active}
      key={item.value}
      // label={item.label}
      onClick={handleClick}
      text={item.label}
    />
  )
}

export class SelectField extends React.PureComponent<SelectFieldProps> {
  render() {
    const { field: name, label, items, onValueChange } = this.props
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = !!(form.touched[name] && form.errors[name])
          return (
            <FormGroup
              intent={error ? Intent.DANGER : undefined} //
              helperText={error}
              label={label}
            >
              <ItemSuggest
                popoverProps={{ minimal: true }}
                className='pt-fill'
                itemPredicate={filterItem}
                itemRenderer={renderItem}
                inputValueRenderer={item => item.label}
                items={items}
                // inputProps={{ value: items[fieldApi.value].label }}
                onItemSelect={item => {
                  form.setFieldValue(name, item.value)
                  if (onValueChange) {
                    onValueChange(item.value)
                  }
                }}
                // selectedValue={fieldApi.value}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
