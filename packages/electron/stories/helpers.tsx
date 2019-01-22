// tslint:disable:no-implicit-dependencies
import { AppContext, GetIntlProvider, Gql } from '@ag/app'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils'
import { IntlProvider } from 'react-intl'
import { ui } from '../src/ui'

export const MockApp: React.FC<{ query: Gql<any, any>; variables?: any; response: object }> = ({
  query,
  variables,
  response,
  children,
}) => {
  const mocks: MockedResponse[] = [
    {
      request: { query, variables },
      result: {
        data: response,
      },
    },
  ]
  return (
    <MockedProvider mocks={mocks}>
      <IntlProvider locale='en'>
        <ApolloConsumer>
          {client => (
            <GetIntlProvider>
              {intl => (
                <AppContext.Provider
                  value={{
                    ui,
                    client,
                    intl,
                    getState: () => {
                      throw new Error('no getState')
                    },
                    dispatch: action('dispatch'),
                    openDb: () => {
                      throw new Error('no openDb')
                    },
                    deleteDb: () => {
                      throw new Error('no deleteDb')
                    },
                  }}
                >
                  {children}
                </AppContext.Provider>
              )}
            </GetIntlProvider>
          )}
        </ApolloConsumer>
      </IntlProvider>
    </MockedProvider>
  )
}
