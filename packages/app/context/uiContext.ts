import { ComponentType } from 'react'
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
  danger?: boolean

  onConfirm: () => any
  confirmText: string

  onCancel?: () => any
  cancelText?: string

  show: boolean
}

export interface DialogProps {
  title: string
  isOpen: boolean
  onClose?: () => any
}

export interface DialogFooterProps {
  primary: ButtonConfig
  secondary?: ButtonConfig
}

export interface LoadingOverlayProps {
  show: boolean
  title: string
}

export interface ButtonConfig {
  title: string
  onClick: () => any
  isDanger?: boolean
}

export interface TabsProps {
  id: string
}

export interface TabProps {
  id: string
  heading: string
  panel: JSX.Element
}

export interface UiContext {
  // special ui
  showToast: (message: string, danger?: boolean) => any

  // dialog
  Alert: ComponentType<AlertProps>
  Dialog: ComponentType<DialogProps>
  DialogBody: ComponentType
  DialogFooter: ComponentType<DialogFooterProps>
  LoadingOverlay: ComponentType<LoadingOverlayProps>

  // layout
  Card: ComponentType<{}>
  Row: ComponentType<{ left?: boolean; right?: boolean; center?: boolean; flex?: number }>
  Column: ComponentType<{ top?: boolean; bottom?: boolean; center?: boolean; flex?: number }>
  Page: ComponentType<{}>
  Container: ComponentType<{}>
  Collapsible: ComponentType<{ show: boolean }>
  Link: ComponentType<{ onClick?: () => any }>
  Text: ComponentType<{ header?: boolean; muted?: boolean; onClick?: () => any }>
  SubmitButton: ComponentType<{ disabled?: boolean; onPress: () => any }>
  DeleteButton: ComponentType<{ disabled?: boolean; onPress: () => any }>

  // form
  Form: React.ComponentType<FormProps>
  CheckboxField: React.ComponentType<CheckboxFieldProps>
  CurrencyField: React.ComponentType<CurrencyFieldProps>
  DateField: React.ComponentType<DateFieldProps>
  Divider: React.ComponentType
  SelectField: React.ComponentType<SelectFieldProps>
  TextField: React.ComponentType<TextFieldProps>
  UrlField: React.ComponentType<UrlFieldProps>

  // tabs
  Tabs: React.ComponentType<TabsProps>
  Tab: React.ComponentType<TabProps>
}
