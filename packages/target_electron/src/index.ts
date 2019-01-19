import { App } from '@ag/app'
import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './store'
import { deleteDb, openDb } from './store/openDb.electron'
import { ui } from './ui'

const runApp = () => {
  ReactDOM.render(
    React.createElement(App, { openDb, deleteDb, store, ui }),
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
