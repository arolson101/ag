// tslint:disable:no-implicit-dependencies
import { App, cancelOperation, ClientDependencies, CoreContext } from '@ag/core'
import { ApolloHooksProvider } from '@ag/util'
import { action } from '@storybook/addon-actions'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { MockedResponse, MockLink } from 'apollo-link-mock'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { storiesOf, ui } from './platform-specific'

export { MockedResponse }
export { action, storiesOf }

export const forever = 2 ** 31 - 1

export const addDelay = (responses: MockedResponse[], delay: number) => {
  return responses.map(r => ({ ...r, delay }))
}

const deps: ClientDependencies = {
  ui,
  scaleImage: action('scaleImage') as any,
  openCropper: action('openCropper') as any,
  getImageFromLibrary: action('getImageFromLibrary') as any,
}

const store = {
  getState: () => {
    throw new Error('no getState')
  },
  dispatch: action('dispatch'),
} as any

const context = App.createContext({ store, deps })

const createClient = (mocks: ReadonlyArray<MockedResponse>) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  })
}

export const MockApp: React.FC<{ mocks?: MockedResponse[] }> = ({ mocks, children }) => {
  const client = createClient(mocks || [])
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <IntlProvider locale='en'>
          <CoreContext.Provider value={context}>{children}</CoreContext.Provider>
        </IntlProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  )
}

export const createCancelMutation = (cancelToken: string) => ({
  request: {
    query: cancelOperation.mutations.cancel,
    variables: { cancelToken },
  },
  result: {
    data: {
      cancel: true,
    },
  },
})
