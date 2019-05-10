import { PopoverButtonProps, TabProps, TabsProps, UiContext, useIntl } from '@ag/core'
import debug from 'debug'
import {
  ActionSheet,
  Button,
  Card,
  Container,
  Content,
  H3,
  List,
  ListItem,
  Spinner,
  Tab,
  Tabs,
  Text,
  Toast,
  View,
} from 'native-base'
import React, { useCallback } from 'react'
import { defineMessages } from 'react-intl'
import { Alert as RnAlert, Dimensions, FlatList } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Omit } from 'utility-types'
import { CheckboxField } from './CheckboxField.nativebase'
import { CurrencyField } from './CurrencyField.nativebase'
import { DateField } from './DateField.nativebase'
import { Form } from './Form.nativebase'
import { Image } from './NativeImage'
import { SelectField } from './SelectField.nativebase'
import { TextField } from './TextField.nativebase'

const log = debug('ui-nativebase:ui')

type RNNTypes = 'LoadingOverlay' | 'Dialog'

export const ui: Omit<UiContext, RNNTypes> = {
  // special ui
  showToast: (message, danger) =>
    Toast.show({
      text: message,
      position: 'bottom',
      duration: 5000,
      type: danger ? 'danger' : undefined,
    }),
  alert: ({ title, body, danger, onConfirm, confirmText, onCancel, cancelText }) => {
    RnAlert.alert(
      title,
      body,
      [
        { text: cancelText, onPress: onCancel, style: 'cancel' }, //
        { text: confirmText, onPress: onConfirm, style: danger ? 'destructive' : 'default' },
      ],
      { cancelable: false }
    )
  },

  // navigation
  NavMenu: ({ items }) => null,

  // layout
  Card: ({ children }) => <Card>{children}</Card>,
  Row: ({ left, right, center, flex, children }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex }}>{children}</View>
  ),
  Column: ({ top, bottom, center, flex, children }) => (
    <View style={{ display: 'flex', flexDirection: 'column', flex }}>{children}</View>
  ),
  Grid: ({ data, renderItem, keyExtractor, size, onClick }) => {
    const { width } = Dimensions.get('window')
    const numColumns = Math.floor(width / size)
    return (
      <FlatList
        columnWrapperStyle={{ justifyContent: 'space-between', paddingVertical: 4 }}
        data={data}
        renderItem={({ item }) => renderItem(item)}
        numColumns={numColumns}
        keyExtractor={keyExtractor}
      />
    )
  },

  Page: ({ children }) => (
    <Container>
      <Content>{children}</Content>
    </Container>
  ),
  Tile: ({ size, margin, children }) => (
    <Container
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
      }}
    >
      {children}
    </Container>
  ),
  Collapsible: ({ show, children }) => (
    <View style={{ display: show ? 'flex' : 'none' }}>{children}</View>
  ),

  // list
  List: ({ children }) => <List>{children}</List>,
  // ListItem: ({ title, image, children, actions }) => <ListItem>{children}</ListItem>,

  // table
  Table: ({ columns, data }) => null,

  // controls
  Spinner,
  Link: ({ onClick, children }) => (
    <Button transparent onPress={onClick as any}>
      <Text>{children}</Text>
    </Button>
  ),
  Text: ({ header, muted, flex, children, onClick }) => {
    const Component: React.ComponentType<any> = header ? H3 : Text
    return (
      <Component note={muted} onClick={onClick} style={{ flex }}>
        {children}
      </Component>
    )
  },
  PopoverButton: React.memo<PopoverButtonProps>(function _PopoverButton(props) {
    const { loading, icon, children, minimal, content } = props
    const intl = useIntl()

    const onPress = useCallback(
      function _onPress() {
        const realOptions = content.filter(opt => !opt.divider)
        const options: string[] = realOptions
          .map(opt => opt.text!)
          .concat(intl.formatMessage(messages.cancel))
        const cancelButtonIndex = realOptions.length

        ActionSheet.show(
          {
            options,
            cancelButtonIndex,
            // title: intl.formatMessage(messages.title),
          },
          async buttonIndex => {
            if (buttonIndex !== cancelButtonIndex) {
              realOptions[buttonIndex].onClick!()
            }
          }
        )
      },
      [content]
    )

    return (
      <Button
        onPress={onPress}
        transparent={minimal}
        bordered={minimal}
        style={{
          minWidth: 40,
          justifyContent: 'space-around',
        }}
      >
        {loading ? (
          <Spinner />
        ) : typeof icon === 'string' ? (
          <FontAwesome name={icon} />
        ) : icon && React.isValidElement(icon) ? (
          icon
        ) : (
          children
        )}
      </Button>
    )
  }),
  Button: ({ onPress, disabled, children }) => (
    <Button onPress={onPress as any} disabled={disabled}>
      {children}
    </Button>
  ),
  DeleteButton: ({ onPress, disabled, children }) => (
    <Button danger block onPress={onPress as any} disabled={disabled}>
      {children}
    </Button>
  ),
  Image,

  // form
  Form,
  CheckboxField,
  CurrencyField,
  DateField,
  Divider: () => <ListItem itemDivider />,
  SelectField,
  TextField,

  Tabs: Tabs as React.ComponentType<TabsProps>,
  Tab: Tab as React.ComponentType<TabProps>,
}

const messages = defineMessages({
  cancel: {
    id: 'ui.nativebase.cancel',
    defaultMessage: 'Cancel',
  },
})
