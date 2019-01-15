import { ComponentType } from 'react'
import { Router } from './routeContext'
import {
  CheckboxFieldProps,
  CurrencyFieldProps,
  DateFieldProps,
  FormProps,
  SelectFieldProps,
  TextFieldProps,
  UrlFieldProps,
} from './uiContextForms'

export interface AlertProps {
  title: string

  body?: string[]

  onConfirm: () => any
  confirmText: string

  onCancel?: () => any
  cancelText?: string

  onClosed: () => any

  show: boolean
}

export interface UiContext {
  // special ui
  confirm: (
    props: { title: string; action: string; onConfirm: () => any; event: React.SyntheticEvent }
  ) => any

  // routes
  Router: Router

  // dialog
  Alert: ComponentType<AlertProps>
  LoadingOverlay: ComponentType<{ show: boolean }>

  // layout
  Page: ComponentType<{}>
  Text: ComponentType<{ children: string | string[] }>
  SubmitButton: ComponentType<{ disabled?: boolean; onPress: (event: React.SyntheticEvent) => any }>
  DeleteButton: ComponentType<{ disabled?: boolean; onPress: (event: React.SyntheticEvent) => any }>

  // form
  Form: React.ComponentType<FormProps>
  CheckboxField: React.ComponentType<CheckboxFieldProps>
  CurrencyField: React.ComponentType<CurrencyFieldProps>
  DateField: React.ComponentType<DateFieldProps>
  Divider: React.ComponentType
  SelectField: React.ComponentType<SelectFieldProps>
  TextField: React.ComponentType<TextFieldProps>
  UrlField: React.ComponentType<UrlFieldProps>
}
