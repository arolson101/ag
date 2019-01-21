import { UiContext } from '@ag/app'
import { Alert, Collapse, Divider, Spinner } from '@blueprintjs/core'
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
    <button type='submit' onClick={onPress} disabled={disabled}>
      {children}
    </button>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <button type='button' onClick={onPress} disabled={disabled}>
      {children}
    </button>
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
