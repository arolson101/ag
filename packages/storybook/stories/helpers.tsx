// tslint:disable:no-implicit-dependencies
import { App, AppContext, ClientDependencies, Gql } from '@ag/app'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { MockedProvider, MockedResponse } from 'react-apollo/test-utils'
import { IntlProvider } from 'react-intl'
import { fetch, storiesOf, ui } from './platform-specific'

export { action, storiesOf }

const deps: ClientDependencies = {
  ui,
  fetch,
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

export const MockApp: React.FC<{ query?: Gql<any, any>; variables?: any; response?: object }> = ({
  query,
  variables,
  response,
  children,
}) => {
  const mocks: MockedResponse[] =
    query && response
      ? [
          {
            request: { query, variables },
            result: response,
          },
        ]
      : []
  return (
    <MockedProvider mocks={mocks}>
      <IntlProvider locale='en'>
        <AppContext.Provider value={context}>{children}</AppContext.Provider>
      </IntlProvider>
    </MockedProvider>
  )
}
