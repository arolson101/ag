import { App } from '@ag/app'
import { initClient } from '@ag/db'
import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './store'
import { deleteDb, openDb } from './store/openDb.electron'
import { ui } from './ui'

const client = initClient({ openDb, deleteDb })

const runApp = () => {
  ReactDOM.render(React.createElement(App, { client, store, ui }), document.getElementById('root'))
}

runApp()

// const registerServiceWorker = require('./registerServiceWorker').default
// registerServiceWorker()

// if (module.hot) {
//   module.hot.accept('./App/App', () => {
//     runApp()
//   })
// }
