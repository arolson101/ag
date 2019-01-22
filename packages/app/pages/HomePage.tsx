import React from 'react'
import { actions } from '../actions'
import { AppQuery, gql, Gql, Link } from '../components'
import { AppContext } from '../context'
import * as T from '../graphql-types'

export namespace HomePage {
  export interface Props {}
}

export class HomePage extends React.PureComponent<HomePage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'HomePage'

  static readonly queries = {
    HomePage: gql`
      query HomePage {
        appDb {
          banks {
            id
            name
            accounts {
              id
              name
            }
          }
        }
      }
    ` as Gql<T.HomePage.Query, T.HomePage.Variables>,
  }

  render() {
    const { ui } = this.context
    const { Page, Container, Text } = ui

    return (
      <Page>
        <AppQuery query={HomePage.queries.HomePage}>
          {({ appDb }) =>
            appDb && (
              <>
                <Container>
                  <Text>home page</Text>
                </Container>
                <Container>
                  <Link to={actions.nav.bankCreate()}>add bank</Link>
                </Container>
                <Container>
                  {!appDb.banks.length ? (
                    <Text>No banks</Text>
                  ) : (
                    appDb.banks.map(bank => (
                      <Container key={bank.id}>
                        <Link to={actions.nav.bank({ bankId: bank.id })}>{bank.name}</Link> [
                        <Link to={actions.nav.bankEdit({ bankId: bank.id })}>edit</Link>]
                        {!bank.accounts.length ? (
                          <Text>No accounts</Text>
                        ) : (
                          bank.accounts.map(account => (
                            <Container key={account.id}>
                              <Text>{account.name}</Text>
                            </Container>
                          ))
                        )}
                      </Container>
                    ))
                  )}
                </Container>
              </>
            )
          }
        </AppQuery>
      </Page>
    )
  }
}
