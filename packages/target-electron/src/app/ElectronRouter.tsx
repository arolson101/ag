import { CoreContext, HomePage, MenuBar } from '@ag/core'
import { Content, Header, Icon, Layout, Menu, Sider } from '@ag/ui-antd'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debug from 'debug'
import { parse } from 'query-string'
import React from 'react'
import { Redirect, Route, Router as ReactRouter, Switch } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import { history } from '../reducers'

// see target-react-native/src/icons.ts
import {
  faCalendarAlt as iconCalendar,
  faHome as iconHome,
  faMoneyCheckAlt as iconBills,
  faPiggyBank as iconBudgets,
  faUniversity as iconAccounts,
} from '@fortawesome/free-solid-svg-icons'

const log = debug('electron:router')

type ComponentWithId = React.ComponentType<any> & { id: string }

const routes: ComponentWithId[] = [
  HomePage, //
]

interface Props {}

const FontIcon: React.FC<{ icon: IconDefinition }> = ({ icon }) => (
  <Icon component={() => <FontAwesomeIcon icon={icon} />} />
)

export class ElectronRouter extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  render() {
    const fallback = `/${routes[0].id}`

    return (
      <ReactRouter history={history}>
        <Layout>
          <SplitPane
            split='vertical'
            minSize={50}
            defaultSize={100}
            resizerStyle={{
              background: '#000',
              opacity: 0.1,
              zIndex: 1,
              boxSizing: 'border-box',
              backgroundClip: 'padding-box',
              cursor: 'col-resize',
              width: 11,
              margin: '0 -5px',
              borderLeft: '5px solid rgba(255, 255, 255, 0)',
              borderRight: '5px solid rgba(255, 255, 255, 0)',
            }}
          >
            <div style={{ overflow: 'auto', height: '100vh' }}>
              <Menu>
                <Menu.Item>
                  <FontIcon icon={iconHome} />
                  <span>Home</span>
                </Menu.Item>
                <Menu.Item>
                  <FontIcon icon={iconAccounts} />
                  <span>Accounts</span>
                </Menu.Item>
                <Menu.Item>
                  <FontIcon icon={iconBills} />
                  <span>Bills</span>
                </Menu.Item>
                <Menu.Item>
                  <FontIcon icon={iconBudgets} />
                  <span>Budgets</span>
                </Menu.Item>
                <Menu.Item>
                  <FontIcon icon={iconCalendar} />
                  <span>Calendar</span>
                </Menu.Item>
              </Menu>

              <MenuBar />
            </div>

            <Content style={{ overflow: 'auto', height: '100vh' }}>
              <Switch>
                {routes.map(Component => (
                  <Route
                    key={Component.id}
                    path={`/${Component.id}`}
                    exact
                    render={props => <Component {...parse(props.location.search)} />}
                  />
                ))}
                <Route
                  render={({ location }) => {
                    log(
                      `"%s" (%O) not found- redirecting to ${fallback}`,
                      location.pathname,
                      location
                    )
                    return <Redirect to={fallback} />
                  }}
                />
              </Switch>
            </Content>
          </SplitPane>
        </Layout>
      </ReactRouter>
    )
  }
}
