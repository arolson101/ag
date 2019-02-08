import debug from 'debug'
import React from 'react'
import { actions } from '../actions'
import { AppQuery, gql, Gql, Link } from '../components'
import { BankDisplay } from '../components/BankDisplay'
import { AppContext } from '../context'
import * as T from '../graphql-types'

const log = debug('app:HomePage')

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
            ...BankDisplay
          }
        }
      }
      ${BankDisplay.fragments.BankDisplay}
    ` as Gql<T.HomePage.Query, T.HomePage.Variables>,
  }

  render() {
    const { ui, dispatch } = this.context
    const { Page, Container, Text } = ui

    return (
      <Page>
        <AppQuery
          query={HomePage.queries.HomePage}
          onCompleted={({ appDb }) => {
            if (!appDb) {
              dispatch(actions.openDlg.login())
            }
          }}
        >
          {({ appDb }) => (
            <>
              <Text header>Accounts</Text>
              {appDb && appDb.banks.map(bank => <BankDisplay bank={bank} key={bank.id} />)}
              <Container>
                <Link dispatch={actions.openDlg.bankCreate()}>add bank</Link>
              </Container>
            </>
          )}
        </AppQuery>
      </Page>
    )
  }
}
