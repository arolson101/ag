import '@babel/polyfill'
import 'haul/hot'

import debug from 'debug'
import { Navigation } from 'react-native-navigation'
import App from './App'
import { fontInit } from './src/icons'
import { root } from './src/navigation'

const log = debug('rn:init')
log.enabled = true

Navigation.registerComponent(`navigation.playground.WelcomeScreen`, () => App)

Navigation.events().registerAppLaunchedListener(async () => {
  log('app launched')
  await fontInit
  log('setting root')
  Navigation.setRoot(root())
})

// export default from './storybook'
