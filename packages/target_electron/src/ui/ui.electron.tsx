import { UiContext } from '@ag/app'
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

  // layout
  Page: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,
  SubmitButton: ({ onPress, children }) => <button onClick={onPress}>{children}</button>,
  DeleteButton: ({ onPress, children }) => <button onClick={onPress}>{children}</button>,

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
