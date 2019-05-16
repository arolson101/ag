import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { CoreDispatch, IntlContext } from '../context'
import { UiContext } from '../context/uiContext'

interface DeleteDbParams {
  dispatch: CoreDispatch
  intl: IntlContext
  dbId: string
  ui: UiContext
}

export const deleteDb = ({ dispatch, ui, intl, dbId }: DeleteDbParams) => {
  const { alert, showToast } = ui

  alert({
    title: intl.formatMessage(messages.title),
    body: intl.formatMessage(messages.body),
    danger: true,

    confirmText: intl.formatMessage(messages.delete),
    onConfirm: () => {
      dispatch(actions.dbDelete.request({ dbId }))
      showToast(intl.formatMessage(messages.deleted), true)
    },

    cancelText: intl.formatMessage(messages.cancel),
    onCancel: () => {},
  })
}

const messages = defineMessages({
  title: {
    id: 'deleteDb.title',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'deleteDb.body',
    defaultMessage: 'This will all your data.  This action cannot be undone.',
  },
  delete: {
    id: 'deleteDb.delete',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'deleteDb.cancel',
    defaultMessage: 'Cancel',
  },
  deleted: {
    id: 'deleteDb.deleted',
    defaultMessage: 'Data deleted',
  },
})
