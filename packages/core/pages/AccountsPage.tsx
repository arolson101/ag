import { Account, Bank } from '@ag/db'
import arrayMove from 'array-move'
import debug from 'debug'
import docuri from 'docuri'
import React, { useCallback, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ActionDesc, TableColumn, useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:AccountsPage')

interface Props {
  componentId?: string
}

const BankTable = Object.assign(
  React.memo<{ bank: Bank }>(function _BankTable({ bank }) {
    type Row = Account
    const intl = useIntl()
    const { Link, Text, Row, Table, Image } = useUi()
    const openBankEditDlg = useAction(actions.openDlg.bankEdit)
    const openAccountCreateDlg = useAction(actions.openDlg.accountCreate)
    const openAccountEditDlg = useAction(actions.openDlg.accountEdit)
    const navAccount = useAction(actions.nav.account)
    const deleteAccount = useAction(thunks.deleteAccount)
    const deleteBank = useAction(thunks.deleteBank)
    const setAccountsOrder = useAction(thunks.setAccountsOrder)
    const accounts = useSelector(selectors.getAccountsForBank)(bank.id)

    const moveRow = useCallback(
      (srcIndex: number, dstIndex: number) => {
        // log('moveRow %d %d', srcIndex, dstIndex)
        const accountIds = arrayMove(accounts, srcIndex, dstIndex) //
          .map(account => account.id)
        setAccountsOrder(accountIds)
      },
      [accounts, setAccountsOrder]
    )

    const syncAccounts = useAction(thunks.syncAccounts)
    const downloadTransactions = useAction(thunks.downloadTransactions)

    const tableEdit = useMemo<ActionDesc>(
      () => ({
        icon: 'edit',
        text: intl.formatMessage(messages.bankEdit),
        onClick: () => openBankEditDlg({ bankId: bank.id }),
      }),
      [intl, openBankEditDlg, bank.id]
    )

    const tableDelete = useMemo<ActionDesc>(
      () => ({
        icon: 'trash',
        text: intl.formatMessage(messages.deleteBank),
        onClick: () => deleteBank(bank),
        danger: true,
      }),
      [deleteBank, bank]
    )

    const rowAdd = useMemo<ActionDesc>(
      () => ({
        icon: 'add',
        text: intl.formatMessage(messages.accountCreate),
        onClick: () => openAccountCreateDlg({ bankId: bank.id }),
      }),
      [intl, bank.id]
    )

    const rowEdit = useCallback(
      (account: Row): ActionDesc => ({
        icon: 'edit',
        text: intl.formatMessage(messages.editAccount),
        onClick: () => openAccountEditDlg({ accountId: account.id }),
      }),
      [intl, openAccountEditDlg]
    )

    const rowDelete = useCallback(
      (account: Row): ActionDesc => ({
        icon: 'trash',
        text: intl.formatMessage(messages.deleteAccount),
        onClick: () => deleteAccount(account),
        danger: true,
      }),
      [deleteAccount]
    )

    const columns = useMemo<Array<TableColumn<Row>>>(
      () => [
        {
          dataIndex: 'visible', // TODO
          width: 30,
          align: 'center',
          title: intl.formatMessage(messages.colVisible),
          render: (text: string, account: Row) => <Text>*</Text>,
        },
        {
          dataIndex: 'number', // TODO
          width: 30,
          align: 'center',
          title: 'favorite',
          render: (text: string, account: Row) => <Text>X</Text>,
        },
        {
          dataIndex: 'icon',
          title: '',
          width: 30,
          render: (text: string, account: Row) => (
            <Image src={account.icon || bank.icon} size='1.5em' />
          ),
        },
        {
          dataIndex: 'name',
          title: intl.formatMessage(messages.colName),
          render: (text: string, account: Row) => (
            <Link onClick={() => navAccount({ accountId: account.id })}>
              <Text>{account.name}</Text>
            </Link>
          ),
        },
        {
          dataIndex: 'sortOrder', // TODO
          width: 30,
          title: 'amount',
          align: 'right',
          render: (text: string, account: Row) => <Text>$123.45</Text>,
        },
        // {
        //   dataIndex: 'sortOrder',
        //   title: 'sortOrder',
        // },
        // {
        //   dataIndex: 'id',
        //   title: 'id',
        // },
        // {
        //   dataIndex: 'number',
        //   title: intl.formatMessage(messages.colNumber),
        // },
      ],
      [navAccount, bank.icon, intl]
    )

    return (
      <Table
        titleText={bank.name}
        titleImage={bank.icon}
        tableEdit={tableEdit}
        tableDelete={tableDelete}
        rowKey={'id'}
        rowAdd={rowAdd}
        rowEdit={rowEdit}
        rowDelete={rowDelete}
        emptyText={intl.formatMessage(messages.noAccounts)}
        data={accounts}
        columns={columns}
        moveRow={moveRow}
        dragId={bank.id}
      />
    )
  }),
  {
    displayName: 'AccountsPage.BankTable',
  }
)

const path = '/accounts'
const route = docuri.route<void, string>(path)

export const AccountsPage = Object.assign(
  React.memo<Props>(function _AccountsPage({ componentId }) {
    const intl = useIntl()
    const openBankCreateDlg = useAction(actions.openDlg.bankCreate)
    const { Page } = useUi()
    const banks = useSelector(selectors.banks)

    // log('data %o', data)

    return (
      <Page
        title={intl.formatMessage(messages.titleText)}
        componentId={componentId}
        button={{
          title: intl.formatMessage(messages.bankAdd),
          onClick: openBankCreateDlg,
        }}
      >
        {banks.map(bank => (
          <BankTable bank={bank} key={bank.id} />
        ))}
      </Page>
    )
  }),
  {
    displayName: 'AccountsPage',
    messages: () => messages,
    path,
    route,
  }
)

const messages = defineMessages({
  contextMenuHeader: {
    id: 'AccountsPage.contextMenuHeader',
    defaultMessage: '{bankName} - {accountName}',
  },
  bankAdd: {
    id: 'AccountsPage.bankAdd',
    defaultMessage: 'Add Bank',
  },
  bankEdit: {
    id: 'AccountsPage.bankEdit',
    defaultMessage: 'Edit Bank',
  },
  deleteBank: {
    id: 'AccountsPage.deleteBank',
    defaultMessage: 'Delete Bank',
  },
  syncAccounts: {
    id: 'AccountsPage.syncAccounts',
    defaultMessage: 'Sync Accounts',
  },
  syncComplete: {
    id: 'AccountsPage.syncComplete',
    defaultMessage: "Synced Accounts for '{name}'",
  },
  accountCreate: {
    id: 'AccountsPage.accountCreate',
    defaultMessage: 'Add Account',
  },
  editAccount: {
    id: 'AccountsPage.editAccount',
    defaultMessage: 'Edit Account',
  },
  deleteAccount: {
    id: 'AccountsPage.deleteAccount',
    defaultMessage: 'Delete Account',
  },
  colName: {
    id: 'AccountsPage.colName',
    defaultMessage: 'Account',
  },
  colNumber: {
    id: 'AccountsPage.colNumber',
    defaultMessage: 'Number',
  },
  colVisible: {
    id: 'AccountsPage.colVisible',
    defaultMessage: 'Visible',
  },
  noAccounts: {
    id: 'AccountsPage.noAccounts',
    defaultMessage: 'No Accounts',
  },
  tabText: {
    id: 'AccountsPage.tabText',
    defaultMessage: 'Accounts',
  },
  titleText: {
    id: 'AccountsPage.titleText',
    defaultMessage: 'Accounts',
  },
  getTransactions: {
    id: 'AccountsPage.getTransactions',
    defaultMessage: 'Download transactions',
  },
  getTransactionsComplete: {
    id: 'AccountsPage.getTransactionsComplete',
    defaultMessage: 'Downloaded transactions for account {name}',
  },
})
