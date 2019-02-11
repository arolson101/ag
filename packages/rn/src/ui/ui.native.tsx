import { pickBestImageUri, UiContext } from '@ag/app'
import {
  Button,
  Card,
  Container,
  Content,
  H3,
  ListItem,
  Spinner,
  Tab,
  Tabs,
  Text,
  Toast,
} from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React from 'react'
import { Image, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { Alert } from './Alert.native'
import { CheckboxField } from './CheckboxField.native'
import { CurrencyField } from './CurrencyField.native'
import { DateField } from './DateField.native'
import { Dialog, DialogBody, DialogFooter } from './Dialog.native'
import { Form } from './Form.native'
import { LoadingOverlay } from './LoadingOverlay.native'
import { SelectField } from './SelectField.native'
import { TextField } from './TextField.native'
import { UrlField } from './UrlField.native'

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
    <View style={{ flexDirection: 'row', alignItems: 'center', flex }}>{children}</View>
  ),
  Column: ({ top, bottom, center, flex, children }) => (
    <View style={{ display: 'flex', flexDirection: 'column', flex }}>{children}</View>
  ),
  Grid: ({ size, gap, children }) => (
    <View style={{ display: 'flex', flexDirection: 'column', margin: gap }}>{children}</View>
  ),

  Page: ({ children }) => (
    <Container>
      <Content>{children}</Content>
    </Container>
  ),
  Tile: ({ size, margin, selected, onClick, children }) => (
    <TouchableOpacity
      onPress={onClick as any}
      style={{
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
        backgroundColor: selected ? platform.brandPrimary : undefined,
        boxShadow: selected ? `0px 0px 4px ${platform.brandPrimary}` : undefined,
      }}
    >
      {children}
    </TouchableOpacity>
  ),
  Collapsible: ({ show, children }) => (
    <View style={{ display: show ? 'flex' : 'none' }}>{children}</View>
  ),

  // controls
  Spinner,
  Link: ({ onClick, children }) => (
    <Button transparent onPress={onClick as any}>
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
    <Button onPress={onPress as any} disabled={disabled}>
      {children}
    </Button>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <Button danger block onPress={onPress as any} disabled={disabled}>
      {children}
    </Button>
  ),
  Image: ({ source, size, margin }) => (
    <Image
      source={source}
      {...pickBestImageUri(source, size)}
      {...{ src: undefined }}
      style={{ margin }}
    />
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
}
