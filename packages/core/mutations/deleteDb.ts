import { defineMessages } from 'react-intl'
import { IntlContext } from '../context'
import { UiContext } from '../context/uiContext'

interface DeleteDbParams {
  dbDelete: (params: { dbId: string }) => any
  intl: IntlContext
  dbId: string
  ui: UiContext
}

export const deleteDb = ({ dbDelete, ui, intl, dbId }: DeleteDbParams) => {
  const { alert, showToast } = ui

  alert({
    title: intl.formatMessage(messages.title),
    body: intl.formatMessage(messages.body),
    danger: true,

    confirmText: intl.formatMessage(messages.delete),
    onConfirm: async () => {
      dbDelete({ dbId })
      showToast(intl.formatMessage(messages.deleted), true)
    },

    cancelText: intl.formatMessage(messages.cancel),
    onCancel: () => {},
  })
}

const messages = defineMessages({
  title: {
    id: 'DeleteDb.title',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'DeleteDb.body',
    defaultMessage: 'This will all your data.  This action cannot be undone.',
  },
  delete: {
    id: 'DeleteDb.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'DeleteDb.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'DeleteDb.deleted',
    defaultMessage: 'Data deleted',
  },
})
