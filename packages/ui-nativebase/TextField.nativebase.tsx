import { CommonTextFieldProps, TextFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import debug from 'debug'
import { Icon, Input, Item, Textarea } from 'native-base'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormContext } from './Form.nativebase'
import { Label } from './Label.nativebase'

const log = debug('ui-nativebase:TextField.nativebase')

export const TextField = Object.assign(
  React.memo<TextFieldProps>(function _TextField(props) {
    const {
      field: name,
      autoFocus,
      label,
      color,
      placeholder,
      secure,
      rows,
      disabled,
      noCorrect,
      leftIcon,
      rightElement,
    } = props

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

    const onChangeText = (text: string) => {
      // log('onChangeText %s', text)
      const { onValueChanged } = props
      form.change(name, text)
      if (onValueChanged) {
        onValueChanged(text)
      }
    }

    const itemProps = { onPress: focus }
    const inputProps = { autoFocus }
    const inputStyle = color ? { color } : {}

    return (
      <Item
        {...itemProps}
        error={touched && error}
        secureTextEntry={secure}
        placeholder={placeholder}
        disabled={disabled}
      >
        <Label label={label} error={touched && error} />
        {rows && rows > 0 ? (
          <Textarea
            editable={!disabled}
            style={{ flex: 1 }}
            rowSpan={rows}
            onChangeText={onChangeText}
            value={field.value}
            ref={textInput}
          />
        ) : (
          <Input
            disabled={disabled}
            style={{ flex: 1, ...inputStyle }}
            onChangeText={onChangeText}
            value={field.value.toString()}
            secureTextEntry={secure}
            numberOfLines={rows}
            autoCapitalize={noCorrect ? 'none' : undefined}
            autoCorrect={noCorrect ? false : undefined}
            multiline={rows ? rows > 0 : undefined}
            ref={textInput}
            {...commonTextFieldProps}
            {...inputProps}
          />
        )}
        {touched && error && <Icon style={{ color: 'red' }} name='close-circle' />}
        {rightElement}
      </Item>
    )
  }),
  {
    displayName: 'TextField',
  }
)
