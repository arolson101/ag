import { UiContext } from './uiContext'

export interface CheckboxFieldProps<Values = any> {
  field: keyof Values & string
  label: string
  disabled?: boolean
}

export interface CurrencyFieldProps<Values = any> {
  field: keyof Values & string
  label: string
  placeholder?: string
  autoFocus?: boolean
  onSubmitEditing?: () => any
  disabled?: boolean
}

export interface DateFieldProps<Values = any> {
  field: keyof Values & string
  label: string
  collapsed?: boolean
  disabled?: boolean
}

export interface FormProps<Values = any> {
  onSubmit: () => void
}

export interface SelectFieldItem {
  label: string
  value: string | number
}

export interface SelectFieldProps<Values = any> {
  field: keyof Values & string
  label: string
  items: SelectFieldItem[]
  onValueChange?: (value: string | number) => any
  searchable?: boolean
  disabled?: boolean
}

export interface TextFieldProps<Values = any> {
  field: keyof Values & string
  label: string
  placeholder?: string
  secure?: boolean
  rows?: number
  color?: string
  autoFocus?: boolean
  onSubmitEditing?: () => any
  noCorrect?: boolean
  inputRef?: any
  disabled?: boolean
}

export interface UrlFieldProps<Values = any> {
  field: keyof Values & string
  favicoField: keyof Values & string
  label: string
  placeholder?: string
  autoFocus?: boolean
  onSubmitEditing?: () => any
  disabled?: boolean
}

export const typedFields = <V extends {}>(uiContext: UiContext) => {
  return {
    Form: uiContext.Form as React.ComponentType<FormProps<V>>,
    CheckboxField: uiContext.CheckboxField as React.ComponentType<CheckboxFieldProps<V>>,
    CurrencyField: uiContext.CurrencyField as React.ComponentType<CurrencyFieldProps<V>>,
    DateField: uiContext.DateField as React.ComponentType<DateFieldProps<V>>,
    Divider: uiContext.Divider,
    SelectField: uiContext.SelectField as React.ComponentType<SelectFieldProps<V>>,
    TextField: uiContext.TextField as React.ComponentType<TextFieldProps<V>>,
    UrlField: uiContext.UrlField as React.ComponentType<UrlFieldProps<V>>,
    // AccountField: AccountField as React.ComponentClass<AccountFieldProps<V>>,
    // BudgetField: BudgetField as React.ComponentClass<BudgetFieldProps<V>>,
    // ColorAddon: ColorAddonField as React.ComponentClass<ColorAddonFieldProps<V>>,
  }
}
