import { IconName, TabProps, TabsProps, UiContext } from '@ag/core'
import {
  Alert,
  Button,
  Card,
  Classes,
  Collapse,
  Colors,
  Dialog,
  Divider,
  H3,
  Icon,
  IconName as BlueprintIconName,
  Intent,
  Menu,
  Overlay,
  Popover,
  Position,
  Spinner,
  Tab,
  Tabs,
  Text,
  Toaster,
} from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import classNames from 'classnames'
import 'normalize.css/normalize.css'
import React from 'react'
import { CheckboxField } from './CheckboxField.blueprint'
import { CurrencyField } from './CurrencyField.blueprint'
import { DateField } from './DateField.blueprint'
import { Form } from './Form.blueprint'
import { Image } from './Image.blueprint'
import { SelectField } from './SelectField.blueprint'
import { TextField } from './TextField.blueprint'

export const AppToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.BOTTOM,
})

export const ui: UiContext = {
  // special ui
  showToast: (message, danger) =>
    AppToaster.show({ message, intent: danger ? Intent.DANGER : Intent.NONE }),

  // dialog
  Alert: props => (
    <Alert
      isOpen={props.show}
      confirmButtonText={props.confirmText}
      onConfirm={props.onConfirm}
      cancelButtonText={props.cancelText}
      onCancel={props.onCancel}
      intent={props.danger ? Intent.DANGER : Intent.PRIMARY}
    >
      <h1>{props.title}</h1>
      {props.body && props.body.map((b, i) => <p key={i}>{b}</p>)}
    </Alert>
  ),

  LoadingOverlay: ({ show }) => (
    <Overlay isOpen={show} canEscapeKeyClose={false} canOutsideClickClose={false}>
      <Spinner className={Classes.OVERLAY} />
    </Overlay>
  ),

  Dialog: ({ isOpen, title, onClose, primary, secondary, children }) => (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      isCloseButtonShown={!!onClose}
      canOutsideClickClose={false}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 5,
          maxHeight: 600,
          overflow: 'auto',
        }}
        className={classNames(Classes.DIALOG_BODY)}
      >
        {children}
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          {secondary && (
            <Button
              onClick={secondary.onClick}
              intent={secondary.isDanger ? Intent.DANGER : Intent.NONE}
              disabled={secondary.disabled}
            >
              {secondary.title}
            </Button>
          )}
          <Button onClick={primary.onClick} intent={Intent.PRIMARY} disabled={primary.disabled}>
            {primary.title}
          </Button>
        </div>
      </div>
    </Dialog>
  ),

  // layout
  Card: ({ children }) => <Card>{children}</Card>,
  Row: ({ left, right, center, flex, children }) => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex }}>
      {children}
    </div>
  ),
  Column: ({ top, bottom, center, flex, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', flex }}>{children}</div>
  ),
  Grid: ({ data, renderItem, size, onClick, flex, scrollable }) => (
    <div
      onClick={onClick}
      style={{
        padding: 5,
        display: 'grid',
        justifyContent: 'space-between',
        gridTemplateColumns: `repeat(auto-fill, ${size}px)`,
        flex,
        overflow: scrollable ? 'auto' : undefined,
      }}
    >
      {data.map((item, idx) => (
        <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  ),

  Page: ({ children }) => <div>{children}</div>,
  Tile: ({ size, margin, children }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin,
        width: size,
        minWidth: size,
        maxWidth: size,
        height: size,
        minHeight: size,
        maxHeight: size,
        overflow: 'visible',
      }}
    >
      {children}
    </div>
  ),
  Collapsible: ({ show, children }) => (
    <Collapse isOpen={show} keepChildrenMounted>
      {children}
    </Collapse>
  ),

  // list
  List: ({ children }) => <Card>{children}</Card>,
  ListItem: ({ title, image, subtitle, children, actions }) => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {title && (
          <H3 style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            {image && (
              <div
                style={{
                  background: `center no-repeat url(${image.uri})`,
                  backgroundSize: 'contain',
                  width: 24,
                  height: 24,
                  margin: 5,
                }}
              />
            )}
            {title}
          </H3>
        )}
        {subtitle && <p className={classNames(Classes.TEXT_MUTED)}>{subtitle}</p>}
      </div>
    </div>
  ),

  // controls
  Spinner,
  Link: ({ onClick, children }) => <a onClick={onClick}>{children}</a>,
  Text: ({ flex, header, muted, children, onClick }) => {
    const Component: React.ComponentType<any> = header ? H3 : Text
    return (
      <Component
        className={classNames(
          Classes.UI_TEXT,
          flex && Classes.FLEX_EXPANDER,
          muted && Classes.TEXT_MUTED,
          header && Classes.HEADING
        )}
        onClick={onClick}
      >
        {children}
      </Component>
    )
  },
  Button: ({ danger, minimal, fill, onPress, disabled, children }) => (
    <Button
      type='button'
      onClick={onPress}
      disabled={disabled}
      fill={fill}
      intent={danger ? Intent.DANGER : undefined}
      minimal={minimal}
      style={{ height: fill ? '100%' : undefined }}
    >
      {children}
    </Button>
  ),
  PopoverButton: ({ icon, disabled, content, minimal, loading, children }) => (
    <Popover
      content={
        <Menu>
          {content.map(({ divider, text, icon: itemIcon, onClick }, i) =>
            divider ? (
              <Menu.Divider key={i} />
            ) : (
              <Menu.Item key={i} text={text} icon={mapIconName(itemIcon)} onClick={onClick} />
            )
          )}
        </Menu>
      }
    >
      <Button
        loading={loading}
        minimal={minimal}
        disabled={disabled}
        icon={
          typeof icon === 'string'
            ? mapIconName(icon)
            : React.isValidElement(icon)
            ? icon
            : undefined
        }
      >
        {children}
      </Button>
    </Popover>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <Button type='button' intent={Intent.DANGER} fill minimal onClick={onPress} disabled={disabled}>
      {children}
    </Button>
  ),
  Image,

  // form
  Form,
  CheckboxField,
  CurrencyField,
  DateField,
  Divider,
  SelectField,
  TextField,

  Tabs: Tabs as React.ComponentType<TabsProps>,
  Tab: Tab as React.ComponentType<TabProps>,
}

export const mapIconName = (icon?: IconName): BlueprintIconName | undefined => {
  switch (icon) {
    case 'url':
      return 'globe-network'

    case 'image':
      return 'media'

    case 'library':
      return 'folder-open'

    case 'refresh':
    case 'trash':
      return icon
  }
}
