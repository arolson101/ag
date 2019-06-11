import { Bank, BankInput, DbChange } from '@ag/db/entities'
import { dbWrite } from '@ag/db/resolvers/dbWrite'
import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'

interface SaveBankParams {
  input: BankInput
  bankId?: string
}

const saveBank = ({ input, bankId }: SaveBankParams): CoreThunk =>
  async function _saveBank(dispatch, getState, { ui: { showToast } }) {
    const state = getState()
    const intl = selectors.getIntl(state)
    const { connection, banksRepository } = selectors.getAppDb(state)

    const t = Date.now()
    let bank: Bank
    let changes: DbChange[]
    if (bankId) {
      bank = await banksRepository.getById(bankId)
      const q = diff<Bank.Props>(bank, input)
      changes = [Bank.change.edit(t, bankId, q)]
      bank.update(t, q)
    } else {
      bank = new Bank(uniqueId(), input)
      bankId = bank.id
      changes = [Bank.change.add(t, bank)]
    }
    // log('dbwrite %o', changes)
    await dbWrite(connection, changes)
    assert.equal(bankId, bank.id)
    // log('get bank %s', bankId)
    assert.deepEqual(bank, await banksRepository.getById(bankId))
    // log('done')

    const intlCtx = { name: bank.name }
    showToast(intl.formatMessage(bankId ? messages.saved : messages.created, intlCtx))
  }

interface DeleteBankParams {
  bank: {
    id: string
    name: string
  }
}

const deleteBank = ({ bank }: DeleteBankParams): CoreThunk =>
  async function _deleteBank(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.getIntl(state)
    const { connection } = selectors.getAppDb(state)

    const intlCtx = { name: bank.name }

    const confirmed = await alert({
      title: intl.formatMessage(messages.title),
      body: intl.formatMessage(messages.deleteBankBody, intlCtx),
      danger: true,

      confirmText: intl.formatMessage(messages.deleteBankConfirm),
      cancelText: intl.formatMessage(messages.cancel),
    })

    if (confirmed) {
      try {
        const t = Date.now()
        const changes = [Bank.change.remove(t, bank.id)]
        await dbWrite(connection, changes)
        showToast(intl.formatMessage(messages.bankDeleted, intlCtx), true)
      } catch (error) {
        ErrorDisplay.show(alert, intl, error)
      }
    }
  }

export const bankThunks = {
  saveBank,
  deleteBank,
}

const messages = defineMessages({
  title: {
    id: 'bankThunks.title',
    defaultMessage: 'Are you sure?',
  },
  deleteBankBody: {
    id: 'bankThunks.deleteBankBody',
    defaultMessage: "This will delete the bank '{name}', all its accounts and their transactions",
  },
  deleteBankConfirm: {
    id: 'bankThunks.deleteBankConfirm',
    defaultMessage: 'Delete',
  },
  cancel: {
    id: 'bankThunks.cancel',
    defaultMessage: 'Cancel',
  },
  bankDeleted: {
    id: 'bankThunks.bankDeleted',
    defaultMessage: "Bank '{name}' deleted",
  },
  saved: {
    id: 'BankForm.saved',
    defaultMessage: `Bank '{name}' saved`,
  },
  created: {
    id: 'BankForm.created',
    defaultMessage: `Bank '{name}' added`,
  },
})
