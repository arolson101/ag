import { CommonTextFieldProps, NumberFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import debug from 'debug'
import { Icon, Input, Item, Textarea } from 'native-base'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormContext } from './Form.nativebase'
import { Label } from './Label.nativebase'

const log = debug('ui-nativebase:NumberField.nativebase')

export const NumberField = Object.assign(
  React.memo<NumberFieldProps>(function _NumberField(props) {
    const { field: name, label, disabled } = props

    const [commonTextFieldProps, setCommonTextFieldProps] = useState<CommonTextFieldProps>({})
    const context = useContext(FormContext)
    const textInput = useRef<TextInput & Textarea>(null)

    const form = useForm()
    const [field, { touched, error }] = useField(name)

    const focus = useCallback(() => {
      let x: any = textInput.current
      if (x && x.wrappedInstance) {
        x = x.wrappedInstance
      }
      if (x && x.focus) {
        x.focus()
      }
    }, [textInput.current])

    useEffect(() => {
      const ref = {
        focus,
        props,
        setCommonTextFieldProps,
      }
      context.addField(ref)
      return () => context.rmvField(ref)
    }, [focus, props, setCommonTextFieldProps])

    const itemProps = { onPress: focus }

    return (
      <Item {...itemProps} error={touched && error} disabled={disabled}>
        <Label label={label} error={touched && error} />
        <Input
          disabled={disabled}
          style={{ flex: 1 }}
          value={field.value.toString()}
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType='numeric'
          ref={textInput}
          {...commonTextFieldProps}
        />
        {touched && error && <Icon style={{ color: 'red' }} name='close-circle' />}
      </Item>
    )
  }),
  {
    displayName: 'NumberField',
  }
)
