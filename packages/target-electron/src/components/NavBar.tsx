import {
  AccountsPage,
  actions,
  BillsPage,
  BudgetsPage,
  CalendarPage,
  CoreContext,
  HomePage,
  MenuBar,
} from '@ag/core'
import { Icon, Menu } from '@ag/ui-antd'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
// see target-react-native/src/icons.ts
import {
  faCalendarAlt as iconCalendar,
  faHome as iconHome,
  faMoneyCheckAlt as iconBills,
  faPiggyBank as iconBudgets,
  faUniversity as iconAccounts,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debug from 'debug'
import React, { useContext } from 'react'
import { Route } from 'react-router-dom'
import useReactRouter from 'use-react-router'

const log = debug('electron:NavBar')

interface Props {}

const FontIcon: React.FC<{ icon: IconDefinition }> = ({ icon }) => (
  <Icon component={() => <FontAwesomeIcon icon={icon} />} />
)

export const NavBar = React.memo<Props>(props => {
  const { dispatch, intl } = useContext(CoreContext)
  const { location } = useReactRouter()

  return (
    <div style={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Menu selectable selectedKeys={[location.pathname]} mode='inline'>
        <Menu.Item
          key={HomePage.path} //
          onClick={() => dispatch(actions.nav.home())}
        >
          <FontIcon icon={iconHome} />
          <span>{intl.formatMessage(HomePage.messages.tabText)}</span>
        </Menu.Item>

        <Menu.Item key={AccountsPage.path} onClick={() => dispatch(actions.nav.accounts())}>
          <FontIcon icon={iconAccounts} />
          <span>{intl.formatMessage(AccountsPage.messages.tabText)}</span>
        </Menu.Item>

        <Menu.Item
          key={BillsPage.path} //
          onClick={() => dispatch(actions.nav.bills())}
        >
          <FontIcon icon={iconBills} />
          <span>{intl.formatMessage(BillsPage.messages.tabText)}</span>
        </Menu.Item>

        <Menu.Item
          key={BudgetsPage.path} //
          onClick={() => dispatch(actions.nav.budgets())}
        >
          <FontIcon icon={iconBudgets} />
          <span>{intl.formatMessage(BudgetsPage.messages.tabText)}</span>
        </Menu.Item>

        <Menu.Item
          key={CalendarPage.path} //
          onClick={() => dispatch(actions.nav.calendar())}
        >
          <FontIcon icon={iconCalendar} />
          <span>{intl.formatMessage(CalendarPage.messages.tabText)}</span>
        </Menu.Item>
      </Menu>

      <MenuBar />
    </div>
  )
})
