import 'node-libs-react-native/globals'

// https://github.com/facebook/metro/issues/287#issuecomment-450903701
if (__DEV__) {
  const IGNORED_WARNINGS = [
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Require cycle:',
  ]
  const oldConsoleWarn = console.warn

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      IGNORED_WARNINGS.some(ignoredWarning =>
        args[0].startsWith(ignoredWarning),
      )
    ) {
      return
    }

    return oldConsoleWarn.apply(console, args)
  }
}

require('./src/app')

// export default from './storybook'
