import { App } from '@ag/app'
import React from 'react'
import ReactDOM from 'react-dom'
import { deleteDb, openDb } from './openDb.electron'
import { ui } from './ui'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'normalize.css/normalize.css'

const runApp = () => {
  ReactDOM.render(
    React.createElement(App, { deleteDb, openDb, ui }),
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
