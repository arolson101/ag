import debug from 'debug'
import React, { useContext, useState } from 'react'
import { QueryHookResult } from 'react-apollo-hooks'
import { actions } from '../actions'
import { gql, Gql, Link, useQuery } from '../components'
import { BankDisplay } from '../components/BankDisplay'
import { CoreContext } from '../context'
import * as T from '../graphql-types'

const log = debug('core:HomePage')

export namespace HomePage {
  export interface Props {}
}

export const HomePage = (props: HomePage.Props) => {
  const { dispatch } = useContext(CoreContext)
  const [dispatched, setDispatched] = useState(false)
  const q = useQuery(HomePage.queries.HomePage)

  if (!q.loading && !q.error && q.data && !q.data.appDb && !dispatched) {
    dispatch(actions.openDlg.login())
    setDispatched(true)
  }

  return <HomePageComponent {...q} />
}

HomePage.id = 'HomePage'

HomePage.queries = {
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

export const HomePageComponent: React.FC<
  QueryHookResult<T.HomePage.Query, T.HomePage.Variables>
> = ({ data, loading }) => {
  const {
    ui: { Page, Row, Text },
  } = useContext(CoreContext)

  return (
    <Page>
      <Text header>Accounts</Text>
      {data &&
        data.appDb &&
        data.appDb.banks.map(bank => <BankDisplay bank={bank} key={bank.id} />)}
      <Row>
        <Link dispatch={actions.openDlg.bankCreate()}>add bank</Link>
      </Row>
    </Page>
  )
}
