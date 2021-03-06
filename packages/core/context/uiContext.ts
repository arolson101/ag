import { ImageUri } from '@ag/util'
import debug from 'debug'
import React, { ComponentType } from 'react'
import {
  CheckboxFieldProps,
  CurrencyFieldProps,
  DateFieldProps,
  FormProps,
  NumberFieldProps,
  SelectFieldProps,
  TextFieldProps,
} from './uiContextForms'

const log = debug('core:uiContext')

export type IconName = 'url' | 'refresh' | 'image' | 'library' | 'trash' | 'edit' | 'add' | 'sync'

interface AlertParams {
  title: string

  body?: string
  danger?: boolean
  error?: boolean

  confirmText: string
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
  image?: ImageId
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
  image?: ImageId
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
  icon?: IconName
  title: string
  onClick: () => any
  isDanger?: boolean
  disabled?: boolean
}

export interface NavMenuItem {
  key: string
  divider?: boolean
  image?: ImageId
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
  image?: ImageId
  subtitle?: string
  button?: ButtonConfig
}

export interface TableColumn<T extends {}> {
  dataIndex: keyof T & string
  title: string
  format?: (text: any) => string
  render?: (text: any, record: T) => React.ReactNode
  width?: number
  align?: 'left' | 'right' | 'center'
}

export interface TableProps<T extends {} = any> {
  titleText?: string
  titleImage?: ImageId
  titleActions?: ActionItem[]
  tableEdit?: ActionDesc
  tableDelete?: ActionDesc
  rowAdd?: ActionDesc
  rowEdit?: (row: T) => ActionDesc
  rowDelete?: (row: T) => ActionDesc
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

export interface ImageSrc {
  width: number
  height: number
  src?: ImageUri
}

export type ImageId = '' | ImageUri | '<image id>'

export interface ImageProps {
  id: ImageId | undefined
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
  showToast: (message: string, danger?: boolean) => any
  alert: (params: AlertParams) => Promise<boolean>

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
    icon?: ImageId
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
  NumberField: React.ComponentType<NumberFieldProps>
  SelectField: React.ComponentType<SelectFieldProps>
  TextField: React.ComponentType<TextFieldProps>

  // tabs
  Tabs: React.ComponentType<TabsProps>
  Tab: React.ComponentType<TabProps>
}
