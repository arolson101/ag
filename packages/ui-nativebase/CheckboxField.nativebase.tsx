import { CheckboxFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import { Item, Right, Switch } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React from 'react'
import { Label } from './Label.nativebase'

export const CheckboxField = Object.assign(
  React.memo<CheckboxFieldProps>(function _CheckboxField(props) {
    const { field: name, label, disabled } = props
    const [field, { error, touched }] = useField<boolean>(name)
    const form = useForm()
    return (
      <Item inlineLabel error={touched && error} style={styles.item}>
        <Label label={label} error={touched && error} />
        <Right>
          <Switch
            onValueChange={(value: boolean) => form.change(name, value)}
            value={field.value}
          />
        </Right>
      </Item>
    )
  }),
  {
    displayName: 'CheckboxField',
  }
)

const styles = {
  item: {
    paddingTop: platform.listItemPadding,
    paddingBottom: platform.listItemPadding,
  },
}
