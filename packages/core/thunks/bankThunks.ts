import { Account, Bank, BankInput, DbChange, DbEntityEdit, Image } from '@ag/db/entities'
import { diff, uniqueId } from '@ag/util'
import assert from 'assert'
import { defineMessages } from 'react-intl'
import { ErrorDisplay } from '../components'
import { selectors } from '../reducers'
import { CoreThunk } from './CoreThunk'
import { dbWrite } from './dbWrite'

interface SaveBankParams {
  input: BankInput
  bankId?: string
}

const saveBank = ({ input, bankId }: SaveBankParams): CoreThunk =>
  async function _saveBank(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const { banksRepository } = selectors.appDb(state)

      const t = Date.now()

      const [iconId, iconChange] = Image.change.create(t, input.iconId)
      input.iconId = iconId

      let bank: Bank
      let changes: DbChange[]
      if (bankId) {
        bank = await banksRepository.getById(bankId)
        const q = diff<Bank.Props>(bank, input)
        changes = [Bank.change.edit(t, bankId, q), ...iconChange]
        bank.update(t, q)
      } else {
        bank = new Bank(uniqueId(), input)
        bankId = bank.id
        changes = [Bank.change.add(t, bank), ...iconChange]
      }
      // log('dbwrite %o', changes)
      await dispatch(dbWrite(changes))
      assert.equal(bankId, bank.id)
      // log('get bank %s', bankId)
      assert.deepStrictEqual(bank, await banksRepository.getById(bankId))
      // log('done')

      const intlCtx = { name: bank.name }
      showToast(intl.formatMessage(bankId ? messages.saved : messages.created, intlCtx))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const deleteBank = (bank: { id: string; name: string }): CoreThunk =>
  async function _deleteBank(dispatch, getState, { ui: { alert, showToast } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const intlCtx = { name: bank.name }

      const confirmed = await alert({
        title: intl.formatMessage(messages.title),
        body: intl.formatMessage(messages.deleteBankBody, intlCtx),
        danger: true,

        confirmText: intl.formatMessage(messages.deleteBankConfirm),
        cancelText: intl.formatMessage(messages.cancel),
      })

      if (confirmed) {
        const t = Date.now()
        const changes = [Bank.change.remove(t, bank.id)]
        await dispatch(dbWrite(changes))
        showToast(intl.formatMessage(messages.bankDeleted, intlCtx), true)
      }
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

const setAccountsOrder = (accountIds: string[]): CoreThunk =>
  async function _setAccountsOrder(dispatch, getState, { ui: { alert } }) {
    const state = getState()
    const intl = selectors.intl(state)

    try {
      const { accountsRepository } = selectors.appDb(state)
      const t = Date.now()
      const accounts = await accountsRepository.getByIds(accountIds)
      if (accounts.length !== accountIds.length) {
        throw new Error('got back wrong number of accounts')
      }
      // log('accounts (before) %o', accounts)
      accounts.sort((a, b) => accountIds.indexOf(a.id) - accountIds.indexOf(b.id))
      const edits = accounts.map(
        ({ id }, idx): DbEntityEdit<Account.Spec> => ({
          id,
          q: { sortOrder: { $set: idx } },
        })
      )
      // log('accounts: %o, edits: %o', accounts, edits)
      const change: DbChange = {
        t,
        edits,
        table: Account,
      }
      await dispatch(dbWrite([change]))
    } catch (error) {
      ErrorDisplay.show(alert, intl, error)
    }
  }

export const bankThunks = {
  saveBank,
  deleteBank,
  setAccountsOrder,
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
    id: 'bankThunks.saved',
    defaultMessage: `Bank '{name}' saved`,
  },
  created: {
    id: 'bankThunks.created',
    defaultMessage: `Bank '{name}' added`,
  },
})
