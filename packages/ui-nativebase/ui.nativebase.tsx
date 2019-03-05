import { AppContext, PopoverButtonProps, UiContext } from '@ag/core'
import debug from 'debug'
import {
  ActionSheet,
  Button,
  Card,
  Container,
  Content,
  H3,
  Icon,
  List,
  ListItem,
  Spinner,
  Tab,
  Tabs,
  Text,
  Toast,
  View,
} from 'native-base'
import React from 'react'
import { defineMessages } from 'react-intl'
import { Dimensions, FlatList } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Omit } from 'utility-types'
import { Alert } from './Alert.nativebase'
import { CheckboxField } from './CheckboxField.nativebase'
import { CurrencyField } from './CurrencyField.nativebase'
import { DateField } from './DateField.nativebase'
import { Form } from './Form.nativebase'
import { Image } from './NativeImage'
import { SelectField } from './SelectField.nativebase'
import { TextField } from './TextField.nativebase'

const log = debug('rn:ui')

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

  // dialog
  Alert,

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
  ListItem: ({ title, image, children, actions }) => <ListItem>{children}</ListItem>,

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
  PopoverButton: class Popover extends React.PureComponent<PopoverButtonProps> {
    static contextType = AppContext
    context!: React.ContextType<typeof AppContext>

    render() {
      const { loading, icon, children, minimal } = this.props
      return (
        <Button
          onPress={this.onPress}
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
    }

    onPress = () => {
      const { intl } = this.context
      const { content } = this.props
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
    }
  },
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

  Tabs: ({ children }) => <Tabs>{children}</Tabs>,
  Tab: ({ heading, panel }) => <Tab heading={heading}>{panel}</Tab>,
}

const messages = defineMessages({
  cancel: {
    id: 'ui.nativebase.cancel',
    defaultMessage: 'Cancel',
  },
})
