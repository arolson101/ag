import { configure } from '@storybook/react'
import debug from 'debug'

debug.enable('*')

// https://github.com/facebook/metro/issues/287#issuecomment-450903701
if (true) {
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

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.tsx?$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)
