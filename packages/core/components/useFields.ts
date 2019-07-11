import React from 'react'
import {
  CheckboxFieldProps,
  CurrencyFieldProps,
  DateFieldProps,
  FormProps,
  NumberFieldProps,
  SelectFieldProps,
  TextFieldProps,
  UiContext,
  useUi,
} from '../context'
import { AccountField, AccountFieldProps } from './AccountField'
import { TextFieldWithIcon, TextFieldWithIconProps } from './TextFieldWithIcon'
import { UrlField, UrlFieldProps } from './UrlField'

export const useFields = <V extends {}>() => {
  const uiContext: UiContext = useUi()
  return {
    Form: uiContext.Form as React.ComponentType<FormProps<V>>,
    AccountField: AccountField as React.ComponentType<AccountFieldProps<V>>,
    CheckboxField: uiContext.CheckboxField as React.ComponentType<CheckboxFieldProps<V>>,
    CurrencyField: uiContext.CurrencyField as React.ComponentType<CurrencyFieldProps<V>>,
    DateField: uiContext.DateField as React.ComponentType<DateFieldProps<V>>,
    Divider: uiContext.Divider,
    NumberField: uiContext.NumberField as React.ComponentType<NumberFieldProps<V>>,
    SelectField: uiContext.SelectField as React.ComponentType<SelectFieldProps<V>>,
    TextField: uiContext.TextField as React.ComponentType<TextFieldProps<V>>,
    TextFieldWithIcon: TextFieldWithIcon as React.ComponentType<TextFieldWithIconProps<V>>,
    UrlField: UrlField as React.ComponentType<UrlFieldProps<V>>,
    // BudgetField: BudgetField as React.ComponentClass<BudgetFieldProps<V>>,
    // ColorAddon: ColorAddonField as React.ComponentClass<ColorAddonFieldProps<V>>,
  }
}
