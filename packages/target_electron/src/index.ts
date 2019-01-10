import { actions, App } from '@ag/app'
import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './store'
import { ui } from './ui'

const runApp = () => {
  ReactDOM.render(
    React.createElement(App, { store, ui }), //
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
