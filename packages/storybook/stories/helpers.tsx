// tslint:disable:no-implicit-dependencies
import { App } from '@ag/core/app'
import { SystemCallbacks } from '@ag/core/context'
import { CoreStore } from '@ag/core/reducers'
import { online } from '@ag/online'
import { createStore } from '@ag/target-electron/src/store'
import { action } from '@storybook/addon-actions'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { MockedResponse, MockLink } from 'apollo-link-mock'
import { createMemoryHistory } from 'history'
import React from 'react'
import { storiesOf, ui } from './platform-specific'

export { MockedResponse }
export { action, storiesOf }

export const forever = 2 ** 31 - 1

export const addDelay = (responses: MockedResponse[], delay: number) => {
  return responses.map(r => ({ ...r, delay }))
}

const sys: SystemCallbacks = {
  openDb: action('openDb') as any,
  deleteDb: action('deleteDb') as any,
  scaleImage: action('scaleImage') as any,
  openCropper: action('openCropper') as any,
  getImageFromLibrary: action('getImageFromLibrary') as any,
}

const createClient = (mocks: ReadonlyArray<MockedResponse>) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  })
}

export const MockApp: React.FC<{ mocks?: MockedResponse[] }> = ({ mocks, children }) => {
  const hist = createMemoryHistory()
  const store = createStore(hist, { sys, online, ui }) as CoreStore
  const client = createClient(mocks || [])
  return <App {...{ sys, ui, client, store, online }}>{children}</App>
}
