const webpackMain = require('electron-webpack/webpack.main.config.js')
const { inspect } = require('util')

webpackMain().then(config => {
  console.log(inspect(config, {
    showHidden: false,
    depth: null,
    colors: true
  }))
})
