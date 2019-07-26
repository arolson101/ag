import { CommonTextFieldProps, CurrencyFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import accounting from 'accounting'
import { Icon, Input, Item } from 'native-base'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import { FormContext } from './Form.nativebase'
import { Label } from './Label.nativebase'
import { mapIconName } from './mapIconName.nativebase'
// import { CalculatorInput } from 'react-native-calculator'

export const CurrencyField = Object.assign(
  React.memo<CurrencyFieldProps>(function _CurrencyField(props) {
    const [commonTextFieldProps, setCommonTextFieldProps] = useState<CommonTextFieldProps>({})
    const context = useContext(FormContext)
    const textInput = useRef<Input>(null)
    const form = useForm()

    const {
      field: name,
      autoFocus,
      label,
      placeholder,
      // returnKeyType,
      leftIcon,
      leftElement,
      rightElement,
    } = props

    const [field, { error, touched }] = useField(name)

    const onChangeText = useCallback(
      (value: string) => {
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
        if (value === '.') {
          form.change(name, '0.')
        } else if ((!Number.isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
          form.change(name, value)
        }
      },
      [form]
    )

    const focus = useCallback(() => {
      const input: any = textInput.current
      if (input && input._root) {
        input._root.focus()
      }
    }, [textInput.current])

    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        const value = e.nativeEvent.text
        if (value.charAt(value.length - 1) === '.' || value === '-') {
          form.change(name, value.slice(0, -1))
        }
      },
      [form, field]
    )

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
    const inputProps = { autoFocus }
    return (
      <Item {...itemProps} error={touched && error} placeholder={placeholder}>
        {leftElement}
        {leftIcon && <Icon name={mapIconName(leftIcon)} />}
        <Label label={label} error={touched && error} />
        {/* <CalculatorInput
            prefix='$ '
            suffix=' USD'
            onChange={x => this.setState({ x })}
            value={fieldApi.value.toString()}
            // fieldTextStyle={{ fontSize: 24 }}
            // fieldContainerStyle={{ height: 36 }}
            // width={Dimensions.get('screen').width}
          /> */}
        <Input
          selectTextOnFocus
          style={{ flex: 1, textAlign: 'right' }}
          onChangeText={onChangeText}
          value={field.value.toString()}
          onBlur={onBlur}
          onFocus={focus}
          // returnKeyType={returnKeyType}
          keyboardType='numeric'
          ref={textInput}
          {...commonTextFieldProps}
          {...inputProps}
        />
        {touched && error && <Icon style={{ color: 'red' }} name='close-circle' />}
        {rightElement}
      </Item>
    )
  }),
  {
    displayName: 'CurrencyField',
  }
)
