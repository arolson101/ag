import { SubmitFunction } from '@ag/util'
import { CurrencyCode } from 'currency-code-map'
import { IconName } from './uiContext'

export declare type Errors<Values> = {
  [K in keyof Values]?: Values[K] extends object ? Errors<Values[K]> : string
}

export type FormChildFcn<Values extends Record<string, any>> = (props: {
  handleSubmit: () => any
  change: (key: keyof Values & string, value: any) => any
  values: Values
}) => React.ReactElement

export interface FormProps<Values = any> {
  initialValues: Values
  validate?: (values: Values) => Errors<Values>
  submit: (values: Values) => Promise<any>
  lastFieldSubmit?: boolean
  submitRef?: React.MutableRefObject<SubmitFunction>
  children: React.ReactElement | Array<React.ReactElement | false | null> | FormChildFcn<Values>
}

export interface SelectFieldItem {
  label: string
  value: string
}

export interface CommonFieldProps<Values> {
  field: keyof Values & string
  label: string
  disabled?: boolean
  flex?: number
  leftIcon?: IconName
  leftElement?: React.ReactChild
  rightElement?: React.ReactChild
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
  currencyCode: CurrencyCode
}

export interface DateFieldProps<Values = any> extends CommonFieldProps<Values> {
  collapsed?: boolean
  highlightDates?: Date[]
  disabledDate?: (date: Date) => boolean
}

export interface NumberFieldProps<Values = any> extends CommonFieldProps<Values> {
  min: number
  max?: number
  integer?: boolean
  step?: number
}

export interface SelectFieldProps<Values = any> extends CommonFieldProps<Values> {
  items: SelectFieldItem[]
  onValueChange?: (value: string) => any
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
  onValueChanged?: (value: string) => any
}
