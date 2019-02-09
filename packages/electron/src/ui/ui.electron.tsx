import { pickBestImageUri, TabProps, TabsProps, UiContext } from '@ag/app'
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
  Intent,
  Overlay,
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
import { CheckboxField } from './CheckboxField.electron'
import { CurrencyField } from './CurrencyField.electron'
import { DateField } from './DateField.electron'
import { Form } from './Form.electron'
import { SelectField } from './SelectField.electron'
import { TextField } from './TextField.electron'
import { UrlField } from './UrlField.electron'

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

  Dialog: ({ isOpen, title, onClose, children }) => (
    <Dialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      isCloseButtonShown={!!onClose}
      canOutsideClickClose={false}
    >
      {children}
    </Dialog>
  ),

  DialogBody: ({ children }) => (
    <div
      style={{ padding: 5, maxHeight: 600, overflow: 'auto' }}
      className={classNames(Classes.DIALOG_BODY)}
    >
      {children}
    </div>
  ),
  DialogFooter: ({ primary, secondary }) => (
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
  Grid: ({ size, gap, onClick, children }) => (
    <div
      onClick={onClick}
      style={{ display: 'grid', gridGap: gap, gridTemplateColumns: `repeat(auto-fill, ${size}px)` }}
    >
      {children}
    </div>
  ),

  Page: ({ children }) => <div>{children}</div>,
  Tile: ({ size, margin, selected, onClick, children }) => (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : undefined,
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
        boxShadow: selected ? `0px 0px 4px ${Colors.BLUE1}` : undefined,
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
  SubmitButton: ({ onPress, disabled, children }) => (
    <Button type='submit' onClick={onPress} disabled={disabled}>
      {children}
    </Button>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <Button type='button' intent={Intent.DANGER} fill minimal onClick={onPress} disabled={disabled}>
      {children}
    </Button>
  ),
  Image: ({ source, size, margin, title }) => {
    return <img title={title} {...pickBestImageUri(source, size)} style={{ margin }} />
  },

  // form
  Form,
  CheckboxField,
  CurrencyField,
  DateField,
  Divider,
  SelectField,
  TextField,
  UrlField,

  Tabs: Tabs as React.ComponentType<TabsProps>,
  Tab: Tab as React.ComponentType<TabProps>,
}
