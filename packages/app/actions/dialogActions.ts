import { FormattedMessage, MessageValue } from 'react-intl'
import { createStandardAction } from 'typesafe-actions'
import { AppAction } from './actions'

export interface Message {
  id: FormattedMessage.MessageDescriptor
  values?: object
}

export interface AlertConfig {
  title: Message

  body?: Message[]

  confirmText: FormattedMessage.MessageDescriptor
  confirmAction?: AppAction

  cancelText?: FormattedMessage.MessageDescriptor
  cancelAction?: AppAction

  show: boolean
}

export const dialogActions = {
  pushAlert: createStandardAction('dialog/pushAlert')<AlertConfig>(),
  dismissAlert: createStandardAction('dialog/dismissAlert')<void>(),
  popAlert: createStandardAction('dialog/popAlert')<void>(),
}
