import { CommonTextFieldProps, CurrencyFieldProps } from '@ag/core'
import accounting from 'accounting'
import { FormikProps, useField } from 'formik'
import { Icon, Input, Item } from 'native-base'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FormContext } from './Form.nativebase'
import { Label } from './Label.nativebase'
// import { CalculatorInput } from 'react-native-calculator'

export const CurrencyField = Object.assign(
  React.memo<CurrencyFieldProps>(function _CurrencyField(props) {
    const [commonTextFieldProps, setCommonTextFieldProps] = useState<CommonTextFieldProps>({})
    const context = useContext(FormContext)
    const textInput = useRef<Input>(null)
    const form = useRef<FormikProps<any>>(null)

    const {
      field: name,
      autoFocus,
      label,
      placeholder,
      onSubmitEditing,
      // returnKeyType,
    } = props

    const [field, { error }] = useField(name)

    const focus = useCallback(() => {
      const input: any = textInput.current
      if (input && input._root) {
        input._root.focus()
      }
    }, [textInput.current])

    const onBlur = useCallback(() => {
      if (form.current) {
        const value = accounting.formatMoney(form.current.values[name] as any)
        form.current.setFieldValue(name, value)
      }
    }, [form.current, field])

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
      <Item {...itemProps} error={!!error} placeholder={placeholder}>
        <Label label={label} error={!!error} />
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
          style={{ flex: 1 }}
          onChangeText={text => form.current!.setFieldValue(name, text)}
          value={field.value.toString()}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
          // returnKeyType={returnKeyType}
          keyboardType='numeric'
          ref={textInput}
          {...commonTextFieldProps}
          {...inputProps}
        />
        {error && <Icon name='close-circle' />}
      </Item>
    )
  }),
  {
    displayName: 'CurrencyField',
  }
)
