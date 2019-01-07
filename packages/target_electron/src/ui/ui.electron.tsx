import { UiContext } from '@ag/app'
import React from 'react'
import { CheckboxField } from './CheckboxField'
import { CurrencyField } from './CurrencyField'
import { DateField } from './DateField'
import { Divider } from './Divider'
import { Form } from './Form'
import { SelectField } from './SelectField'
import { TextField } from './TextField'
import { UrlField } from './UrlField'

export const ui: UiContext = {
  Page: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,

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
