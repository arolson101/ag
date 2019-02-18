import { CommonTextFieldProps, CurrencyFieldProps } from '@ag/app'
import accounting from 'accounting'
import { Field, FieldProps, FormikProps } from 'formik'
import { Icon, Input, Item } from 'native-base'
import * as React from 'react'
import { TextInput } from 'react-native'
import { FormContext } from './Form.native'
import { Label } from './Label.native'
// import { CalculatorInput } from 'react-native-calculator'

interface State {
  commonTextFieldProps: CommonTextFieldProps
}

export class CurrencyField extends React.PureComponent<CurrencyFieldProps> {
  static contextType = FormContext
  context!: React.ContextType<typeof FormContext>

  state: State = { commonTextFieldProps: {} }

  private textInput = React.createRef<TextInput>()
  private form?: FormikProps<any>

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
    if (ref && ref._root) {
      ref._root.focus()
    }
  }

  render() {
    const {
      field: name,
      autoFocus,
      label,
      placeholder,
      onSubmitEditing,
      // returnKeyType,
    } = this.props
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          this.form = form
          const error = !!(form.touched[name] && form.errors[name])
          const itemProps = { onPress: this.focus }
          const inputProps = { autoFocus }
          return (
            <Item {...itemProps} error={error} placeholder={placeholder}>
              <Label label={label} error={error} />
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
                onChangeText={form.handleChange(name)}
                value={field.value.toString()}
                onBlur={this.onBlur}
                onSubmitEditing={onSubmitEditing}
                // returnKeyType={returnKeyType}
                keyboardType='numeric'
                ref={this.textInput}
                {...this.state.commonTextFieldProps}
                {...inputProps}
              />
              {error && <Icon name='close-circle' />}
            </Item>
          )
        }}
      </Field>
    )
  }

  onBlur = () => {
    const { field } = this.props
    if (this.form) {
      const value = accounting.formatMoney(this.form.values[field] as any)
      this.form.setFieldValue(field, value)
    }
  }
}
