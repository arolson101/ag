import debug from 'debug'
import docuri from 'docuri'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { useAction, useIntl, useSelector, useUi } from '../context'
import { selectors } from '../reducers'

const log = debug('core:BillsPage')

interface Props {
  componentId?: string
}

const path = '/bills'
const route = docuri.route<void, string>(path)

export const BillsPage = Object.assign(
  React.memo<Props>(function _BillsPage({ componentId }) {
    const intl = useIntl()
    const openBillCreateDlg = useAction(actions.openDlg.billCreate)
    const { Page, Row, Text } = useUi()
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
        <Text header>Bills</Text>
        {bills.map(bill => (
          <Text key={bill.id}>{bill.name}</Text>
        ))}
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
  titleText: {
    id: 'BillsPage.titleText',
    defaultMessage: 'Bills',
  },
  billAdd: {
    id: 'BillsPage.billAdd',
    defaultMessage: 'Add Bill',
  },
})
