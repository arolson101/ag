import { ImageSource } from '@ag/util'
import debug from 'debug'
import { ComponentType } from 'react'
import { Omit } from 'utility-types'
import {
  CheckboxFieldProps,
  CurrencyFieldProps,
  DateFieldProps,
  FormProps,
  SelectFieldProps,
  TextFieldProps,
} from './uiContextForms'

const log = debug('app:uiContext')

export type IconName = 'url' | 'refresh' | 'image' | 'library' | 'trash' | 'edit' | 'add' | 'sync'

export interface AlertParams {
  title: string

  body?: string
  danger?: boolean

  onConfirm: () => any
  confirmText: string

  onCancel?: () => any
  cancelText?: string
}

export interface ButtonProps {
  danger?: boolean
  fill?: boolean
  minimal?: boolean
  disabled?: boolean
  onPress: (e: React.SyntheticEvent) => any
  icon?: IconName | React.ReactElement<any>
}

export interface DialogProps {
  title: string
  isOpen: boolean
  onClose?: () => any
  primary: ButtonConfig
  secondary?: ButtonConfig
}

export interface ListItem {
  image?: ImageSource
  title?: string
  subtitle?: React.ReactNode
  actions?: PopoverItem[]
  contextMenuHeader?: string
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
  defaultActiveKey: string
  id: string
}

export interface TabProps {
  id: string
  title: string // used by blueprintjs
  tab: string // used by antd
  heading: string // used by nativebase
}

export const tabConfig = (id: string, name: string) => ({
  id,
  key: id,
  title: name,
  tab: name,
  heading: name,
})

export interface ImageProps {
  src: ImageSource
  size?: number
  margin?: number
  title?: string
}

export interface PopoverItem {
  divider?: boolean
  text?: string
  icon?: IconName
  onClick?: () => any
}

export interface PopoverButtonProps extends Omit<ButtonProps, 'onPress'> {
  content: PopoverItem[]
  minimal?: boolean
  loading?: boolean
}

export interface UiContext {
  // special ui
  showToast: (message: string, danger?: boolean) => any
  alert: (params: AlertParams) => any

  // dialog
  Dialog: ComponentType<DialogProps>
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
  }>
  Collapsible: ComponentType<{ show: boolean }>

  // list
  List: ComponentType<{
    items: ListItem[]
    header?: React.ReactElement<any>
    footer?: React.ReactElement<any>
  }>

  // controls
  Spinner: ComponentType
  Link: ComponentType<{ onClick?: (e: React.SyntheticEvent) => any }>
  Text: ComponentType<{
    flex?: number
    header?: boolean
    muted?: boolean
    onClick?: (e: React.SyntheticEvent) => any
  }>
  PopoverButton: ComponentType<PopoverButtonProps>
  Button: ComponentType<ButtonProps>
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

  // tabs
  Tabs: React.ComponentType<TabsProps>
  Tab: React.ComponentType<TabProps>
}
