import { UiContext } from '@ag/app'
import { Alert, ProgressBar, Spinner } from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'normalize.css/normalize.css'
import React from 'react'
import { CheckboxField } from './CheckboxField'
import { confirm } from './confirm'
import { CurrencyField } from './CurrencyField'
import { DateField } from './DateField'
import { Divider } from './Divider'
import { Form } from './Form'
import { Router } from './Router'
import { SelectField } from './SelectField'
import { TextField } from './TextField'
import { UrlField } from './UrlField'

export const ui: UiContext = {
  // special ui
  confirm,

  // routes
  Router,

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
  Text: ({ children }) => <span>{children}</span>,
  SubmitButton: ({ onPress, disabled, children }) => (
    <button onClick={onPress} disabled={disabled}>
      {children}
    </button>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <button onClick={onPress} disabled={disabled}>
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
