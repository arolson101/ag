import { DateFieldProps } from '@ag/core/context'
import { formatDate, standardizeDate, useField, useForm } from '@ag/util'
import { Body, Icon, ListItem, Text } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React, { useCallback, useState } from 'react'
import { DatePickerIOS } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Label } from './Label.nativebase'

export const DateField = Object.assign(
  React.memo<DateFieldProps>(function _DisplayName(props) {
    const { field: name, label, collapsed } = props
    const [picking, setPicking] = useState(false)
    const [field, { error, touched }] = useField(name)
    const colorStyle = {
      ...(picking ? { color: platform.brandPrimary } : {}),
      ...(error ? { color: platform.brandDanger } : {}),
    }

    const form = useForm()

    const onPress = useCallback(() => {
      setPicking(!picking)
    }, [picking, setPicking])

    const onDateChange = useCallback(
      (date: Date) => {
        const value = standardizeDate(date)
        form.change(name, value)
        setPicking(false)
      },
      [setPicking, form]
    )

    if (collapsed) {
      return null
    }

    return (
      <>
        <ListItem button onPress={onPress}>
          <Label label={label} error={error} />
          <Body>
            <Text style={{ color: platform.textColor, ...colorStyle }}>
              {formatDate(new Date(field.value))}
            </Text>
          </Body>
          {touched && error && <Icon name='close-circle' />}
        </ListItem>
        <Collapsible collapsed={!picking}>
          <DatePickerIOS mode='date' date={new Date(field.value)} onDateChange={onDateChange} />
        </Collapsible>
      </>
    )
  }),
  { displayName: 'DateField' }
)
