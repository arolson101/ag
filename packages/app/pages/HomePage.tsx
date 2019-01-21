import React from 'react'
import { AppQuery, gql, Gql, Link } from '../components'
import { AppContext } from '../context'
import * as T from '../graphql-types'
import { go } from '../routes'

export namespace HomePage {
  export type Props = void
}

const queries = {
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

export class HomePage extends React.PureComponent<HomePage.Props> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'HomePage'

  render() {
    const { ui } = this.context
    const { Page, Container, Text } = ui

    return (
      <Page>
        <AppQuery query={queries.HomePage}>
          {({ appDb }) =>
            appDb && (
              <>
                <Container>
                  <Text>home page</Text>
                </Container>
                <Container>
                  <Link to={go.bankCreate()}>add bank</Link>
                </Container>
                <Container>
                  {!appDb.banks.length ? (
                    <Text>No banks</Text>
                  ) : (
                    appDb.banks.map(bank => (
                      <Container key={bank.id}>
                        <Link to={go.bank({ bankId: bank.id })}>{bank.name}</Link> [
                        <Link to={go.bankEdit({ bankId: bank.id })}>edit</Link>]
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
