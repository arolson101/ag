import { CoreContext, HomePage, MenuBar } from '@ag/core'
import { Content, Header, Layout, Menu, Sider } from '@ag/ui-antd'
import debug from 'debug'
import { parse } from 'query-string'
import React from 'react'
import { Redirect, Route, Router as ReactRouter, Switch } from 'react-router-dom'
import { history } from '../reducers'

const log = debug('electron:router')

type ComponentWithId = React.ComponentType<any> & { id: string }

const routes: ComponentWithId[] = [
  HomePage, //
]

interface Props {}

export class ElectronRouter extends React.PureComponent<Props> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  render() {
    const fallback = `/${routes[0].id}`

    return (
      <ReactRouter history={history}>
        <Layout>
          <Layout>
            <Sider width={300}>
              <MenuBar />
            </Sider>

            <Content>
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
          </Layout>
        </Layout>
      </ReactRouter>
    )
  }
}
