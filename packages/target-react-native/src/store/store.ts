import { CoreAction } from '@ag/core/actions'
import { CoreDependencies } from '@ag/core/context'
import { CoreState, CoreStore } from '@ag/core/reducers'
import { intlStateFromLocale } from '@ag/core/reducers/intlReducer'
import { initialThemeState, ThemeState } from '@ag/core/reducers/themeReducer'
import { thunks } from '@ag/core/thunks'
import debug from 'debug'
import { NativeModules, Platform } from 'react-native'
import { applyMiddleware, createStore as reduxCreateStore, DeepPartial } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { RnState, rootReducer } from '../reducers'

const log = debug('rn:store')

const getPlatform = (): PlatformName => {
  switch (Platform.OS) {
    case 'ios':
    case 'android':
      return Platform.OS

    default:
      // return 'mac'
      return 'pc'
  }
}

export const getInitialState = (): DeepPartial<CoreState> => {
  const theme: ThemeState = {
    ...initialThemeState,
    platform: getPlatform(),
    mode: 'light',
  }

  const locale = (Platform.OS === 'ios'
    ? (NativeModules.SettingsManager.settings.AppleLocale as string)
    : (NativeModules.I18nManager.localeIdentifier as string)
  ).replace('_', '-')

  const intl = intlStateFromLocale(locale)

  return { theme, intl }
}

export const createStore = (dependencies: CoreDependencies) => {
  const middleware = [
    thunk.withExtraArgument(dependencies), //
  ]

  const initialState = getInitialState()

  const store = reduxCreateStore<RnState, CoreAction, {}, {}>(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  ) as CoreStore

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../reducers', () => {
      log('reducers updated')
      store.replaceReducer(rootReducer)
    })
  }

  store.dispatch(thunks.init())

  return store
}
