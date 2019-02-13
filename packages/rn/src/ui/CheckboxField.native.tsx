import { CheckboxFieldProps } from '@ag/app'
import { Field, FieldProps } from 'formik'
import { Item, Right, Switch } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import * as React from 'react'
import { Label } from './Label.native'

export class CheckboxField extends React.PureComponent<CheckboxFieldProps> {
  render() {
    const { field: name, label, disabled } = this.props
    return (
      <Field name={name} disabled={disabled}>
        {({ field, form }: FieldProps) => {
          const error = !!form.errors[name]
          return (
            <Item inlineLabel error={error} style={styles.item}>
              <Label label={label} error={error} />
              <Right>
                <Switch
                  onValueChange={(value: boolean) => form.setFieldValue(name, value)}
                  value={field.value}
                />
              </Right>
            </Item>
          )
        }}
      </Field>
    )
  }
}

const styles = {
  item: {
    paddingTop: platform.listItemPadding,
    paddingBottom: platform.listItemPadding,
  },
}