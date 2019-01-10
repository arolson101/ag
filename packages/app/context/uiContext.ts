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

export interface UiContext {
  // special ui
  confirm: (
    props: { title: string; action: string; onConfirm: () => any; event: React.SyntheticEvent }
  ) => any

  // routes
  Router: Router

  // layout
  Page: ComponentType<{}>
  Text: ComponentType<{ children: string | string[] }>
  SubmitButton: ComponentType<{ onPress: (event: React.SyntheticEvent) => any }>
  DeleteButton: ComponentType<{ onPress: (event: React.SyntheticEvent) => any }>

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
