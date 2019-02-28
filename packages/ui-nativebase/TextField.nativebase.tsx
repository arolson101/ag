import { CommonTextFieldProps, TextFieldProps } from '@ag/core'
import debug from 'debug'
import { Field, FieldProps, FormikProps } from 'formik'
import { Icon, Input, Item, Textarea } from 'native-base'
import React from 'react'
import { TextInput } from 'react-native'
import { FormContext } from './Form.nativebase'
import { Label } from './Label.nativebase'

const log = debug('app:TextField.nativebase')

interface State {
  commonTextFieldProps: CommonTextFieldProps
}

export class TextField<Values> extends React.PureComponent<TextFieldProps<Values>, State> {
  static contextType = FormContext
  context!: React.ContextType<typeof FormContext>

  state: State = { commonTextFieldProps: {} }

  private textInput = React.createRef<TextInput & Textarea>()
  private form!: FormikProps<Values>

  componentWillMount() {
    this.context.addField(this)
  }

  componentWillUnmount() {
    this.context.rmvField(this)
  }

  setCommonTextFieldProps = (commonTextFieldProps: CommonTextFieldProps) => {
    this.setState({ commonTextFieldProps })
  }

  focus = () => {
    const ref: any = this.textInput.current
    if (ref && ref._root && ref._root.focus) {
      ref._root.focus()
    }
  }

  render() {
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
    } = this.props
    return (
      <Field name={name}>
        {({ field, form }: FieldProps<Values>) => {
          this.form = form
          const error = !!(form.touched[name] && form.errors[name])
          const itemProps = { onPress: this.focus }
          const inputProps = { autoFocus }
          const inputStyle = color ? { color } : {}
          return (
            <Item
              {...itemProps}
              error={error}
              secureTextEntry={secure}
              placeholder={placeholder}
              disabled={disabled}
            >
              <Label label={label} error={error} />
              {rows && rows > 0 ? (
                <Textarea
                  editable={!disabled}
                  bordered={false}
                  style={{ flex: 1 }}
                  rowSpan={rows}
                  onChangeText={this.onChangeText}
                  value={field.value}
                  ref={this.textInput}
                />
              ) : (
                <Input
                  disabled={disabled}
                  style={{ flex: 1, ...inputStyle }}
                  onChangeText={this.onChangeText}
                  value={field.value.toString()}
                  onSubmitEditing={onSubmitEditing}
                  secureTextEntry={secure}
                  numberOfLines={rows}
                  autoCapitalize={noCorrect ? 'none' : undefined}
                  autoCorrect={noCorrect ? false : undefined}
                  multiline={rows ? rows > 0 : undefined}
                  ref={this.textInput}
                  {...this.state.commonTextFieldProps}
                  {...inputProps}
                />
              )}
              {error && <Icon name='close-circle' />}
              {rightElement}
            </Item>
          )
        }}
      </Field>
    )
  }

  onChangeText = (text: string) => {
    // log('onChangeText %s', text)
    const { field, onValueChanged } = this.props
    this.form.setFieldValue(field, text)
    if (onValueChanged) {
      onValueChanged(text)
    }
  }
}
