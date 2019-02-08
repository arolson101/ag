import { pickBestImageUri, TabProps, TabsProps, UiContext } from '@ag/app'
import {
  Alert,
  Button,
  Card,
  Classes,
  Collapse,
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
    <div className={classNames(Classes.DIALOG_BODY, 'overflow-y: auto')}>{children}</div>
  ),
  DialogFooter: ({ primary, secondary }) => (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        {secondary && (
          <Button
            onClick={secondary.onClick}
            intent={secondary.isDanger ? Intent.DANGER : Intent.NONE}
          >
            {secondary.title}
          </Button>
        )}
        <Button onClick={primary.onClick} intent={Intent.PRIMARY}>
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

  Page: ({ children }) => <div>{children}</div>,
  Container: ({ children }) => <div>{children}</div>,
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
  Image: ({ source, size, margin }) => {
    return <img {...pickBestImageUri(source, size)} style={{ margin }} />
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
