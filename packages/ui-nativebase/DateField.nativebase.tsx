import { DateFieldProps } from '@ag/core/context'
import { formatDate, standardizeDate, useField, useForm } from '@ag/util'
import { Body, Icon, ListItem, Text } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React, { useCallback, useState } from 'react'
import { DatePickerIOS } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Label } from './Label.nativebase'
import { mapIconName } from './mapIconName.nativebase'

export const DateField = Object.assign(
  React.memo<DateFieldProps>(function _DisplayName(props) {
    const { field: name, label, collapsed, leftIcon, leftElement, rightElement } = props
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
          {leftElement}
          {leftIcon && <Icon name={mapIconName(leftIcon)} />}

          <Label label={label} error={error} />
          <Body>
            <Text style={{ color: platform.textColor, textAlign: 'right', ...colorStyle }}>
              {formatDate(new Date(field.value))}
            </Text>
          </Body>
          {touched && error && <Icon style={{ color: 'red' }} name='close-circle' />}
          {rightElement}
        </ListItem>
        <Collapsible collapsed={!picking}>
          <DatePickerIOS mode='date' date={new Date(field.value)} onDateChange={onDateChange} />
        </Collapsible>
      </>
    )
  }),
  { displayName: 'DateField' }
)
