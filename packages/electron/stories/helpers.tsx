// tslint:disable:no-implicit-dependencies
import { AppContext, ClientDependencies, GetIntlProvider, Gql } from '@ag/app'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils'
import { IntlProvider } from 'react-intl'
import { ui } from '../src/ui'

const clientDependencies: ClientDependencies = {
  ui,
  openDb: () => {
    throw new Error('no openDb')
  },
  deleteDb: () => {
    throw new Error('no deleteDb')
  },
  httpRequest: action('httpRequest') as any,
  resizeImage: action('resizeImage') as any,
  getImageFromLibrary: action('getImageFromLibrary') as any,
}

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
                    client,
                    intl,
                    getState: () => {
                      throw new Error('no getState')
                    },
                    dispatch: action('dispatch'),
                    ...clientDependencies,
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
