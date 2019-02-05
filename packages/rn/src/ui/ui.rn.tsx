import { UiContext } from '@ag/app'
import { Button, Card, H3, ListItem, Tab, Tabs, Text, Toast, View } from 'native-base'
import React from 'react'
import { Image } from 'react-native'
import { Alert } from './Alert'
import { CheckboxField } from './CheckboxField'
import { CurrencyField } from './CurrencyField'
import { DateField } from './DateField'
import { Dialog, DialogBody, DialogFooter } from './Dialog'
import { Form } from './Form'
import { LoadingOverlay } from './LoadingOverlay'
import { SelectField } from './SelectField'
import { TextField } from './TextField'
import { UrlField } from './UrlField'

export const ui: UiContext = {
  // special ui
  showToast: (message, danger) =>
    Toast.show({
      text: message,
      position: 'bottom',
      duration: 5000,
      type: danger ? 'danger' : undefined,
    }),

  // dialog
  Alert,

  LoadingOverlay,

  Dialog,
  DialogBody,
  DialogFooter,

  // layout
  Card: ({ children }) => <Card>{children}</Card>,
  Row: ({ left, right, center, flex, children }) => (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', flex }}>{children}</View>
  ),
  Column: ({ top, bottom, center, flex, children }) => (
    <View style={{ display: 'flex', flexDirection: 'column', flex }}>{children}</View>
  ),

  Page: ({ children }) => <View>{children}</View>,
  Container: ({ children }) => <View>{children}</View>,
  Collapsible: ({ show, children }) => (
    <View style={{ display: show ? 'flex' : 'none' }}>{children}</View>
  ),
  Link: ({ onClick, children }) => (
    <Button transparent onPress={onClick}>
      <Text>{children}</Text>
    </Button>
  ),
  Text: ({ header, muted, children, onClick }) => {
    const Component: React.ComponentType<any> = header ? H3 : Text
    return (
      <Component note={muted} onClick={onClick}>
        {children}
      </Component>
    )
  },
  SubmitButton: ({ onPress, disabled, children }) => (
    <Button onPress={onPress} disabled={disabled}>
      <Text>{children}</Text>
    </Button>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <Button danger block onPress={onPress} disabled={disabled}>
      <Text>{children}</Text>
    </Button>
  ),

  // form
  Form,
  CheckboxField,
  CurrencyField,
  DateField,
  Divider: () => <ListItem itemDivider />,
  SelectField,
  TextField,
  UrlField,

  Tabs: ({ children }) => <Tabs>{children}</Tabs>,
  Tab: ({ heading, panel }) => <Tab heading={heading}>{panel}</Tab>,

  Image: ({ size, source }) => <Image width={size} height={size} source={source} />,
}
