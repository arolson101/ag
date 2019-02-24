import { UiContext } from './uiContext'

export interface FormProps<Values = any> {
  onSubmit: () => void
  lastFieldSubmit?: boolean
}

export interface SelectFieldItem {
  label: string
  value: string | number
}

interface CommonFieldProps<Values> {
  field: keyof Values & string
  label: string
  disabled?: boolean
  flex?: number
}

export interface CommonTextFieldProps {
  autoFocus?: boolean
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  onSubmitEditing?: () => any
  blurOnSubmit?: boolean
}

export interface CheckboxFieldProps<Values = any> extends CommonFieldProps<Values> {}

export interface CurrencyFieldProps<Values = any>
  extends CommonFieldProps<Values>,
    CommonTextFieldProps {
  placeholder?: string
}

export interface DateFieldProps<Values = any> extends CommonFieldProps<Values> {
  collapsed?: boolean
}

export interface SelectFieldProps<Values = any> extends CommonFieldProps<Values> {
  items: SelectFieldItem[]
  onValueChange?: (value: string | number) => any
  searchable?: boolean
}

export interface TextFieldProps<Values = any>
  extends CommonFieldProps<Values>,
    CommonTextFieldProps {
  placeholder?: string
  secure?: boolean
  rows?: number
  color?: string
  noCorrect?: boolean
  inputRef?: any
}

export interface UrlFieldProps<Values = any>
  extends CommonFieldProps<Values>,
    CommonTextFieldProps {
  favicoField: keyof Values & string
  favicoWidth: number
  favicoHeight: number
  placeholder?: string
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
