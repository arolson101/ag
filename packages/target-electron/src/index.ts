import debug from 'debug'
import React from 'react'
import ReactDOM from 'react-dom'
import ElectronApp from './app/ElectronApp'

const log = debug('electron:index')

if (process.env.NODE_ENV === 'development') {
  process.traceProcessWarnings = true
  process.traceDeprecation = true
  process.noDeprecation = true // TODO
}

const render = (Component: React.ComponentType) => {
  ReactDOM.render(
    React.createElement(Component, {}), //
    document.getElementById('root')
  )
}

render(ElectronApp)

// const registerServiceWorker = require('./registerServiceWorker').default
// registerServiceWorker()

if (module.hot) {
  module.hot.accept('./app/ElectronApp', () => {
    log('re-render')
    render(ElectronApp)
  })
}
