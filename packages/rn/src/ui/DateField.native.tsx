import { DateFieldProps } from '@ag/app'
import { formatDate, standardizeDate } from '@ag/app/util/date'
import { Field, FieldProps, FormikProps } from 'formik'
import { Body, Icon, ListItem, Text } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import * as React from 'react'
import { DatePickerIOS } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Label } from './Label.native'

interface State {
  picking: boolean
}

export class DateField extends React.PureComponent<DateFieldProps> {
  private form?: FormikProps<any>

  state: State = {
    picking: false,
  }

  render() {
    const { field: name, label, collapsed } = this.props
    if (collapsed) {
      return null
    }
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          this.form = form
          const error = !!(form.touched[name] && form.errors[name])
          const itemProps = { onPress: this.onPress }
          const colorStyle = {
            ...(this.state.picking ? { color: platform.brandPrimary } : {}),
            ...(error ? { color: platform.brandDanger } : {}),
          }
          return (
            <>
              <ListItem button {...itemProps}>
                <Label label={label} error={error} />
                <Body>
                  <Text style={{ color: platform.textColor, ...colorStyle }}>
                    {formatDate(new Date(field.value))}
                  </Text>
                </Body>
                {error && <Icon name='close-circle' />}
              </ListItem>
              <Collapsible collapsed={this.state.picking}>
                <DatePickerIOS
                  mode='date'
                  date={new Date(field.value)}
                  onDateChange={this.onDateChange}
                />
              </Collapsible>
            </>
          )
        }}
      </Field>
    )
  }

  onPress = () => {
    this.setState({ picking: !this.state.picking })
  }

  onDateChange = (date: Date) => {
    if (this.form) {
      const { field } = this.props
      const value = standardizeDate(date)
      this.form.setFieldValue(field, value)
      this.setState({ picking: false })
    }
  }
}
