import {
  AccountsPage,
  actions,
  BillsPage,
  BudgetsPage,
  CalendarPage,
  CoreAction,
  HomePage,
  useDispatch,
  useIntl,
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
import { DocRoute } from 'docuri'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import useReactRouter from 'use-react-router'

const log = debug('electron:NavBar')

interface Props {}

const FontIcon: React.FC<{ icon: IconDefinition }> = ({ icon }) => (
  <Icon component={() => <FontAwesomeIcon icon={icon} />} />
)

type NavComponent = React.ComponentType & {
  path: string
  route: DocRoute<any, string>
  messages: {
    tabText: FormattedMessage.MessageDescriptor
  }
}

interface NavItem {
  Component: NavComponent
  nav: () => CoreAction
  icon: IconDefinition
}

const navItems: NavItem[] = [
  {
    Component: HomePage,
    nav: actions.nav.home,
    icon: iconHome,
  },
  {
    Component: AccountsPage,
    nav: actions.nav.accounts,
    icon: iconAccounts,
  },
  {
    Component: BillsPage,
    nav: actions.nav.bills,
    icon: iconBills,
  },
  {
    Component: BudgetsPage,
    nav: actions.nav.budgets,
    icon: iconBudgets,
  },
  {
    Component: CalendarPage,
    nav: actions.nav.calendar,
    icon: iconCalendar,
  },
]

export const NavBar = React.memo<Props>(props => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { location } = useReactRouter()

  const selectedKeys = navItems
    .filter(item => location.pathname.startsWith(item.Component.path))
    .map(item => item.Component.path)

  return (
    <div style={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Menu selectable selectedKeys={selectedKeys} mode='inline'>
        {navItems.map(item => (
          <Menu.Item
            key={item.Component.path} //
            onClick={() => dispatch(item.nav())}
          >
            <FontIcon icon={item.icon} />
            <span>{intl.formatMessage(item.Component.messages.tabText)}</span>
          </Menu.Item>
        ))}
      </Menu>

      {/* <MenuBar /> */}
    </div>
  )
})
