import 'node-libs-react-native/globals'

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

process.env.DEBUG = 'app*,rn:*'

// bypass lodash exceptions 'process.binding is not supported'
process.binding = () => undefined

require('./src/app')

// export default from './storybook'
