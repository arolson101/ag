import { ImageUri } from '@ag/util'
import debug from 'debug'
import React, { ComponentType } from 'react'
import { Omit } from 'utility-types'
import {
  CheckboxFieldProps,
  CurrencyFieldProps,
  DateFieldProps,
  FormProps,
  SelectFieldProps,
  TextFieldProps,
} from './uiContextForms'

const log = debug('core:uiContext')

export type IconName = 'url' | 'refresh' | 'image' | 'library' | 'trash' | 'edit' | 'add' | 'sync'

export interface AlertParams {
  title: string

  body?: string
  danger?: boolean
  error?: boolean

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

export interface CardProps {
  image?: ImageUri
  title?: string
}

export interface ContextMenuProps {
  header?: string
  actions?: ActionItem[]
}

export interface DialogProps {
  title: string
  isOpen: boolean
  onClose?: () => any
  primary?: ButtonConfig
  secondary?: ButtonConfig
}

export interface ListItem {
  image?: ImageUri
  title?: React.ReactNode
  subtitle?: React.ReactNode
  content?: React.ReactNode
  contextMenuHeader?: string
  actions?: ActionItem[]
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
  onClick: () => any
  isDanger?: boolean
  disabled?: boolean
}

export interface NavMenuItem {
  key: string
  divider?: boolean
  image?: ImageUri
  title?: string
  active?: boolean
  onClick?: () => any
  subitems?: NavMenuItem[]
  actions?: ActionItem[]
}

export interface NavMenuProps {
  items: NavMenuItem[]
}

export interface PageProps {
  componentId?: string
  title: string
  image?: ImageUri
  subtitle?: string
  button?: ButtonConfig
}

export interface TableColumn<T extends {}> {
  dataIndex: keyof T & string
  title: string
  format?: (text: string) => string
  render?: (text: string, record: T, index: number) => React.ReactNode
  width?: string | number
  align?: 'left' | 'right' | 'center'
}

export interface TableProps<T extends {} = any> {
  titleText?: string
  titleImage?: ImageUri
  titleContextMenuHeader?: string
  titleActions?: ActionItem[]
  tableEdit?: ActionDesc
  tableDelete?: ActionDesc
  rowAdd?: ActionDesc
  rowEdit?: ActionDesc
  rowDelete?: ActionDesc
  rowContextMenu?: (row: T) => ContextMenuProps
  rowKey: keyof T & string
  emptyText?: string
  data: T[]
  columns: Array<TableColumn<T>>
  dragId?: string
  moveRow?: (srcIndex: number, dstIndex: number) => any
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
  src: ImageUri | undefined
  size?: number | string
  margin?: number
  title?: string
}

export interface ActionDesc {
  text: string
  icon: IconName
  disabled?: boolean
  onClick: () => any
  danger?: boolean
}

export interface ActionItem {
  divider?: boolean
  text?: string
  icon?: IconName
  disabled?: boolean
  onClick?: () => any
  danger?: boolean
}

export interface PopoverButtonProps extends Omit<ButtonProps, 'onPress'> {
  content: ActionItem[]
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

  // navigation
  NavMenu: ComponentType<NavMenuProps>

  // layout
  Card: ComponentType<CardProps>
  Row: ComponentType<{ left?: boolean; right?: boolean; center?: boolean; flex?: number }>
  Column: ComponentType<{ top?: boolean; bottom?: boolean; center?: boolean; flex?: number }>
  Grid: ComponentType<GridProps>
  Page: ComponentType<PageProps>
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

  // table
  Table: ComponentType<TableProps>

  // controls
  Spinner: ComponentType
  Link: ComponentType<{ onClick?: (e: React.SyntheticEvent) => any }>
  Text: ComponentType<{
    flex?: number
    icon?: ImageUri
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
