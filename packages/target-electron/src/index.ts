import debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import ElectronApp, { start } from './app/ElectronApp'
import { hist, store } from './app/store'

const log = debug('electron:index')

if (process.env.NODE_ENV === 'development') {
  process.traceProcessWarnings = true
  process.traceDeprecation = true
  process.noDeprecation = true // TODO
}

const render = (Component: typeof ElectronApp) => {
  ReactDOM.render(
    React.createElement(Component, { store, hist }), //
    document.getElementById('root')
  )
}

render(ElectronApp)

start(store)

// const registerServiceWorker = require('./registerServiceWorker').default
// registerServiceWorker()

if (module.hot) {
  module.hot.accept('./app/ElectronApp', () => {
    log('re-render')
    const next = require('./app/ElectronApp').default
    render(next)
  })
}
