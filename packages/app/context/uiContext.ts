import debug from 'debug'
import { ComponentType } from 'react'
import { ImageSource } from '../util'
import {
  CheckboxFieldProps,
  CurrencyFieldProps,
  DateFieldProps,
  FormProps,
  SelectFieldProps,
  TextFieldProps,
  UrlFieldProps,
} from './uiContextForms'

const log = debug('app:uiContext')

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

export interface GridProps<T = any> {
  data: ReadonlyArray<T>
  renderItem: (item: T) => JSX.Element
  keyExtractor: (item: T, index: number) => string
  size: number
  onClick?: (e: React.SyntheticEvent) => any
  flex?: number
  scrollable?: boolean
}

export interface ButtonConfig {
  title: string
  onClick: (e: React.SyntheticEvent) => any
  isDanger?: boolean
  disabled?: boolean
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

export interface ImageProps {
  src: ImageSource
  size?: number
  margin?: number
  title?: string
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
  Grid: ComponentType<GridProps>
  Page: ComponentType<{}>
  Tile: ComponentType<{
    size?: number
    margin?: number
    selected?: boolean
    onClick?: (e: React.SyntheticEvent) => any
  }>
  Collapsible: ComponentType<{ show: boolean }>

  // controls
  Spinner: ComponentType
  Link: ComponentType<{ onClick?: (e: React.SyntheticEvent) => any }>
  Text: ComponentType<{
    flex?: number
    header?: boolean
    muted?: boolean
    onClick?: (e: React.SyntheticEvent) => any
  }>
  SubmitButton: ComponentType<{ disabled?: boolean; onPress: (e: React.SyntheticEvent) => any }>
  DeleteButton: ComponentType<{ disabled?: boolean; onPress: (e: React.SyntheticEvent) => any }>
  Image: React.ComponentType<ImageProps>

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
