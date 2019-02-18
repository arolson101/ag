import { CommonTextFieldProps, TextFieldProps } from '@ag/app'
import { Field, FieldProps } from 'formik'
import { Icon, Input, Item, Textarea } from 'native-base'
import React from 'react'
import { TextInput } from 'react-native'
import { FormContext } from './Form.native'
import { Label } from './Label.native'

interface State {
  commonTextFieldProps: CommonTextFieldProps
}

export class TextField<Values> extends React.PureComponent<TextFieldProps<Values>, State> {
  static contextType = FormContext
  context!: React.ContextType<typeof FormContext>

  state: State = { commonTextFieldProps: {} }

  private textInput = React.createRef<TextInput & Textarea>()

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
    } = this.props
    return (
      <Field name={name}>
        {({ field, form }: FieldProps<Values>) => {
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
                  onChangeText={form.handleChange(name)}
                  value={field.value}
                  ref={this.textInput}
                />
              ) : (
                <Input
                  disabled={disabled}
                  style={{ flex: 1, ...inputStyle }}
                  onChangeText={form.handleChange(name)}
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
            </Item>
          )
        }}
      </Field>
    )
  }
}
