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
  title: string
  heading: string
  panel: JSX.Element
}

export interface ImageUri {
  width: number
  height: number
  uri: string
}

export interface ImageProps {
  source: ImageUri[]
  size: number
  margin?: number
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

  // controls
  Spinner: ComponentType
  Link: ComponentType<{ onClick?: () => any }>
  Text: ComponentType<{ flex?: number; header?: boolean; muted?: boolean; onClick?: () => any }>
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

  // image
  Image: React.ComponentType<ImageProps>
}

export const pickBestImageUri = (source: ImageUri[], size: number) => {
  if (!source.length) {
    return undefined
  }
  const best = source.find(img => img.width >= size) || source[source.length - 1]
  return best.uri
}
