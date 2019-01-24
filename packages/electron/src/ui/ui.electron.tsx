import { UiContext } from '@ag/app'
import {
  Alert,
  Button,
  Classes,
  Collapse,
  Dialog,
  Divider,
  Intent,
  Spinner,
} from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'normalize.css/normalize.css'
import React from 'react'
import { CheckboxField } from './CheckboxField'
import { confirm } from './confirm'
import { CurrencyField } from './CurrencyField'
import { DateField } from './DateField'
import { Form } from './Form'
import { ElectronRouter } from './Router.electron'
import { SelectField } from './SelectField'
import { TextField } from './TextField'
import { UrlField } from './UrlField'

export const ui: UiContext = {
  // special ui
  confirm,

  // routes
  Router: ElectronRouter,

  // dialog
  Alert: props => (
    <Alert
      isOpen={props.show}
      onClosed={props.onClosed}
      confirmButtonText={props.confirmText}
      onConfirm={props.onConfirm}
      cancelButtonText={props.cancelText}
      onCancel={props.onCancel}
    >
      <h1>{props.title}</h1>
      {props.body && props.body.map((b, i) => <p key={i}>{b}</p>)}
    </Alert>
  ),

  LoadingOverlay: props => (props.show ? <Spinner /> : null),

  Dialog: ({ isOpen, title, onClose, children }) => (
    <Dialog title={title} isOpen={isOpen} onClose={onClose}>
      {children}
    </Dialog>
  ),

  DialogBody: ({ children }) => <div className={Classes.DIALOG_BODY}>{children}</div>,
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
  Page: ({ children }) => <div>{children}</div>,
  Container: ({ children }) => <div>{children}</div>,
  Collapsible: ({ show, children }) => (
    <Collapse isOpen={show} keepChildrenMounted>
      {children}
    </Collapse>
  ),
  Text: ({ children, onClick }) => <span onClick={onClick}>{children}</span>,
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

  // form
  Form,
  CheckboxField,
  CurrencyField,
  DateField,
  Divider,
  SelectField,
  TextField,
  UrlField,
}
