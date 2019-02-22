import 'node-libs-react-native/globals'
import 'abortcontroller-polyfill'
import flatMap from 'array.prototype.flatmap'

Array.prototype.flatMap = flatMap.getPolyfill()


// https://github.com/facebook/metro/issues/287#issuecomment-450903701
if (__DEV__) {
  const IGNORED_WARNINGS = [
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    // 'Require cycle:',
    'Unbalanced calls start/end for tag',
  ]
  const REQUIRE_CYCLE = 'Require cycle:'
  const oldConsoleWarn = console.warn

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (IGNORED_WARNINGS.some(ignoredWarning => args[0].startsWith(ignoredWarning)) ||
        (args[0].startsWith(REQUIRE_CYCLE) && args[0].match(/node_modules/)))
    ) {
      return
    }

    return oldConsoleWarn.apply(console, args)
  }
}

// set localstorage options to bypass exceptions in 'debug' module
if (!window.localStorage)
  window.localStorage = {
    getItem: (name: string) => undefined,
    setItem: (name: string, value: any) => undefined,
    removeItem: (name: string) => undefined,
  }

process.env.DEBUG = '*'

// bypass lodash exceptions 'process.binding is not supported'
process.binding = () => undefined


import { AppRegistry } from 'react-native'
import { getStorybookUI, configure } from '@storybook/react-native'

import './rn-addons'

// import stories
configure(() => {
  require('./stories')
}, module)

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({})

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('storybook', () => StorybookUIRoot)

export default StorybookUIRoot
