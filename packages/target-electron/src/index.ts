import React from 'react'
import ReactDOM from 'react-dom'
import ElectronApp from './app/ElectronApp'

if (process.env.NODE_ENV === 'development') {
  process.traceProcessWarnings = true
  process.traceDeprecation = true
  process.noDeprecation = true // TODO
}

const runApp = () => {
  ReactDOM.render(
    React.createElement(ElectronApp, {}), //
    document.getElementById('root')
  )
}

runApp()

// const registerServiceWorker = require('./registerServiceWorker').default
// registerServiceWorker()

if (module.hot) {
  module.hot.accept()
}