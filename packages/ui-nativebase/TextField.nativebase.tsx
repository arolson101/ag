import { CommonTextFieldProps, TextFieldProps } from '@ag/core'
import debug from 'debug'
import { FormikProps, useField } from 'formik'
import { Icon, Input, Item, Textarea } from 'native-base'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormContext } from './Form.nativebase'
import { Label } from './Label.nativebase'

const log = debug('ui-nativebase:TextField.nativebase')

export const TextField = Object.assign(
  React.memo<TextFieldProps>(function _TextField(props) {
    const [commonTextFieldProps, setCommonTextFieldProps] = useState<CommonTextFieldProps>({})
    const context = useContext(FormContext)
    const textInput = useRef<TextInput & Textarea>(null)
    const form = useRef<FormikProps<any>>(null)

    const {
      field: name,
      autoFocus,
      label,
      color,
      placeholder,
      secure,
      rows,
      onSubmitEditing,
      disabled,
      noCorrect,
      leftIcon,
      rightElement,
    } = props

    const [field, { error }] = useField(name)

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
      const { field, onValueChanged } = props
      form.current!.setFieldValue(field, text)
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
        error={!!error}
        secureTextEntry={secure}
        placeholder={placeholder}
        disabled={disabled}
      >
        <Label label={label} error={!!error} />
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
            onSubmitEditing={onSubmitEditing}
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
        {error && <Icon name='close-circle' />}
        {rightElement}
      </Item>
    )
  }),
  {
    displayName: 'TextField',
  }
)
