import { UiContext } from '@ag/app'
import React from 'react'
import { CheckboxField } from './CheckboxField'
import { confirm } from './confirm'
import { CurrencyField } from './CurrencyField'
import { DateField } from './DateField'
import { Divider } from './Divider'
import { Form } from './Form'
import { RouteSelector } from './RouteSelector'
import { SelectField } from './SelectField'
import { TextField } from './TextField'
import { UrlField } from './UrlField'

export const ui: UiContext = {
  // special ui
  confirm,

  // routes
  RouteSelector,

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
