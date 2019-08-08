import { Bill } from '@ag/db'
import { formatCurrency, formatDate } from '@ag/util'
import arrayMove from 'array-move'
import debug from 'debug'
import docuri from 'docuri'
import React, { useCallback, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { RRule } from 'rrule'
import { actions } from '../actions'
import { ActionDesc, TableColumn, useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'
import { thunks } from '../thunks'

const log = debug('core:BillsPage')

interface Props {
  componentId?: string
}

const path = '/bills'
const route = docuri.route<void, string>(path)

const BillGroup = Object.assign(
  React.memo<{ group: string; bills: Bill[] }>(function _BillGroup({ group, bills }) {
    type Row = Bill & { rrule: RRule }
    const intl = useIntl()
    const { Image, Table, Text } = useUi()
    const openBillEditDlg = useAction(actions.openDlg.billEdit)
    const deleteBill = useAction(thunks.deleteBill)
    const setBillsOrder = useAction(thunks.setBillsOrder)
    const getAccount = useSelector(selectors.getAccount)
    const currency = useSelector(selectors.currency)

    const data = useMemo<Row[]>(
      () => bills.map(bill => ({ ...bill, rrule: RRule.fromString(bill.rruleString) })),
      [bills]
    )

    const moveRow = useCallback(
      (srcIndex: number, dstIndex: number) => {
        // log('moveRow %d %d', srcIndex, dstIndex)
        const billIds = arrayMove(bills, srcIndex, dstIndex) //
          .map(bill => bill.id)
        setBillsOrder(billIds)
      },
      [bills, setBillsOrder]
    )

    const rowEdit = useCallback(
      (bill: Row): ActionDesc => ({
        icon: 'edit',
        text: intl.formatMessage(messages.editBill),
        onClick: () => openBillEditDlg({ billId: bill.id }),
      }),
      [intl, openBillEditDlg]
    )

    const rowDelete = useCallback(
      (bill: Row): ActionDesc => ({
        icon: 'trash',
        text: intl.formatMessage(messages.deleteBill),
        onClick: () => deleteBill(bill),
        danger: true,
      }),
      [deleteBill]
    )

    const columns = useMemo<Array<TableColumn<Row>>>(
      () => [
        {
          dataIndex: 'iconId',
          title: '',
          width: 30,
          render: (text: string, bill: Row) => <Image id={bill.iconId} size='1.5em' />,
        },
        {
          dataIndex: 'name',
          title: 'name', // intl.formatMessage(messages.colName),
          // render: (text: string, bill: Row) => (
          //   <Link onClick={() => navBill({ billId: bill.id })}>
          //     <Text>{bill.name}</Text>
          //   </Link>
          // ),
        },
        {
          dataIndex: 'rrule',
          title: 'frequency',
          width: 100,
          render: (value: RRule, bill: Row) => value.toText(),
        },
        {
          dataIndex: 'rrule',
          title: 'next',
          width: 100,
          render: (value: RRule, bill: Row) => formatDate(value.after(new Date())),
        },
        {
          dataIndex: 'amount',
          align: 'right',
          title: 'amount',
          width: 100,
          render: (value: string, bill: Row) => {
            const account = getAccount(bill.account)
            return formatCurrency(intl, value, account ? account.currencyCode : currency)
          },
        },
        // {
        //   dataIndex: 'id',
        //   title: 'id',
        // },
        // {
        //   dataIndex: 'number',
        //   title: intl.formatMessage(messages.colNumber),
        // },
      ],
      [intl, Image, getAccount]
    )

    return (
      <Table
        titleText={group}
        // tableEdit={tableEdit}
        // tableDelete={tableDelete}
        rowKey={'id'}
        // rowAdd={rowAdd}
        rowEdit={rowEdit}
        rowDelete={rowDelete}
        emptyText={intl.formatMessage(messages.emptyText)}
        data={data}
        columns={columns}
        moveRow={moveRow}
        dragId={`group-${group}`}
      />
    )
  }),
  { displayName: 'BillGroup' }
)

export const BillsPage = Object.assign(
  React.memo<Props>(function _BillsPage({ componentId }) {
    const intl = useIntl()
    const openBillCreateDlg = useAction(actions.openDlg.billCreate)
    const { Page, Row, Text, Image } = useUi()
    const bills = useSelector(selectors.bills)

    return (
      <Page
        title={intl.formatMessage(messages.titleText)}
        componentId={componentId}
        button={{
          title: intl.formatMessage(messages.billAdd),
          onClick: openBillCreateDlg,
        }}
      >
        <BillGroup group='default' bills={bills} />
      </Page>
    )
  }),
  {
    displayName: 'BillsPage',
    path,
    route,
    messages: () => messages,
  }
)

const messages = defineMessages({
  tabText: {
    id: 'BillsPage.tabText',
    defaultMessage: 'Bills',
  },
  emptyText: {
    id: 'BillsPage.emptyText',
    defaultMessage: 'No bills',
  },
  titleText: {
    id: 'BillsPage.titleText',
    defaultMessage: 'Bills',
  },
  billAdd: {
    id: 'BillsPage.billAdd',
    defaultMessage: 'Add Recurring Transaction',
  },
  editBill: {
    id: 'BillsPage.editBill',
    defaultMessage: 'Edit Bill',
  },
  deleteBill: {
    id: 'BillsPage.deleteBill',
    defaultMessage: 'Delete Bill',
  },
})
