import { App } from '@ag/app'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import '@blueprintjs/core/lib/css/blueprint.css'
// import '@blueprintjs/icons/lib/css/blueprint-icons.css'
// import 'normalize.css/normalize.css'
import { deleteDb, openDb } from './openDb.electron'

const runApp = () => {
  ReactDOM.render(React.createElement(App, { deleteDb, openDb }), document.getElementById('root'))
}

runApp()

// const registerServiceWorker = require('./registerServiceWorker').default
// registerServiceWorker()

// if (module.hot) {
//   module.hot.accept('./App/App', () => {
//     runApp()
//   })
// }
