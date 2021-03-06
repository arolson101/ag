import { Bill, DbChange, DbEntityEdit, Image } from '@ag/db/entities'
import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { dbWrite } from './dbWrite'

interface SaveBillParams {
  input: Bill.Props
  billId?: string
}

const saveBill = ({ input, billId }: SaveBillParams): CoreThunk =>
  async function _saveBill(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const { billRepository } = selectors.appDb(state)

      const t = Date.now()

      const [iconId, iconChange] = Image.change.create(t, input.iconId)
      input.iconId = iconId

      let bill: Bill
      let changes: DbChange[]
      if (billId) {
        bill = await billRepository.getById(billId)
        const q = diff<Bill.Props>(bill, input)
        changes = [Bill.change.edit(t, billId, q), ...iconChange]
      } else {
        bill = new Bill(uniqueId(), input)
        billId = bill.id
        changes = [Bill.change.add(t, bill), ...iconChange]
      }
      await dispatch(dbWrite(changes))

      const intlCtx = { name: bill.name }
      showToast(intl.formatMessage(billId ? messages.saved : messages.created, intlCtx))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const deleteBill = (bill: { id: string; name: string }): CoreThunk =>
  async function _deleteBill(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const intlCtx = { name: bill.name }

      const confirmed = await alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.deleteBillBody, intlCtx),
        danger: true,

        confirmText: intl.formatMessage(messages.deleteBillConfirm),
        cancelText: intl.formatMessage(messages.cancel),
      })

      if (confirmed) {
        const t = Date.now()
        const changes = [Bill.change.remove(t, bill.id)]
        await dispatch(dbWrite(changes))
        showToast(intl.formatMessage(messages.billDeleted, intlCtx), true)
      }
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const setBillsOrder = (billIds: string[]): CoreThunk =>
  async function _setBillsOrder(dispatch, getState, { ui: { alert } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const { billRepository } = selectors.appDb(state)
      const t = Date.now()
      const bills = await billRepository.getByIds(billIds)
      if (Object.keys(bills).length !== billIds.length) {
        throw new Error('got back wrong number of bills')
      }
      // log('bills (before) %o', bills)
      const edits = Object.values(bills)
        .filter(({ id, sortOrder }) => sortOrder !== billIds.indexOf(id))
        .map(
          ({ id }, idx): DbEntityEdit<Bill.Spec> => ({
            id,
            q: { sortOrder: { $set: billIds.indexOf(id) } },
          })
        )
      // log('bills: %o, edits: %o', bills, edits)
      const change: DbChange = {
        t,
        edits,
        table: 'bill',
      }
      await dispatch(dbWrite([change]))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

export const billThunks = {
  saveBill,
  deleteBill,
  setBillsOrder,
}

const messages = defineMessages({
  title: {
    id: 'billThunks.title',
    defaultMessage: 'Are you sure?',
  },
  deleteBillBody: {
    id: 'billThunks.deleteBillBody',
    defaultMessage: "This will delete the bill '{name}'",
  },
  deleteBillConfirm: {
    id: 'billThunks.deleteBillConfirm',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'billThunks.cancel',
    defaultMessage: 'Cancel',
  },
  billDeleted: {
    id: 'billThunks.billDeleted',
    defaultMessage: "Bill '{name}' deleted",
  },
  saved: {
    id: 'billThunks.saved',
    defaultMessage: `Bill '{name}' saved`,
  },
  created: {
    id: 'billThunks.created',
    defaultMessage: `Bill '{name}' added`,
  },
})
