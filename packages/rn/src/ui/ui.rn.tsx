import { TabsProps, UiContext } from '@ag/app'
import { Button, Card, H3, ListItem, Tab, Tabs, Text, Toast, View } from 'native-base'
import React from 'react'
import { Alert } from './Alert'
import { CheckboxField } from './CheckboxField'
import { CurrencyField } from './CurrencyField'
import { DateField } from './DateField'
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

  Dialog: ({ isOpen, title, onClose, children }) => null,
  // (
  //   <Dialog title={title} isOpen={isOpen} onClose={onClose} canOutsideClickClose={false}>
  //     {children}
  //   </Dialog>
  // ),

  DialogBody: ({ children }) => null, // <div className={Classes.DIALOG_BODY}>{children}</div>,
  DialogFooter: ({ primary, secondary }) => null,
  // (
  //   <div className={Classes.DIALOG_FOOTER}>
  //     <div className={Classes.DIALOG_FOOTER_ACTIONS}>
  //       {secondary && (
  //         <Button
  //           onClick={secondary.onClick}
  //           intent={secondary.isDanger ? Intent.DANGER : Intent.NONE}
  //         >
  //           {secondary.title}
  //         </Button>
  //       )}
  //       <Button onClick={primary.onClick} intent={Intent.PRIMARY}>
  //         {primary.title}
  //       </Button>
  //     </div>
  //   </div>
  // ),

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

  Tabs: Tabs as React.ComponentType<TabsProps>,
  Tab: ({ title, panel }) => <Tab heading={title}>{panel}</Tab>,
}
