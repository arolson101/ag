import { App } from '@ag/app'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import debug from 'debug'
import { remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { router, ui } from './ui'

const log = debug('app:renderer')

const graphQlServer = remote.getGlobal('graphQlServer')
log('graphQlServer: ' + graphQlServer)

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({ uri: graphQlServer }),
  cache: new InMemoryCache(),
})

const runApp = () => {
  ReactDOM.render(
    React.createElement(App, { router, client, ui }), //
    document.getElementById('root')
  )
}

runApp()

// const registerServiceWorker = require('./registerServiceWorker').default
// registerServiceWorker()

// if (module.hot) {
//   module.hot.accept('./App/App', () => {
//     runApp()
//   })
// }
