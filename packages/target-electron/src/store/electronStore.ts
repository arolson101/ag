import { CoreDependencies, CoreDispatch } from '@ag/core/context'
import { intlStateFromLocale } from '@ag/core/reducers/intlReducer'
import { initialThemeState, ThemeState } from '@ag/core/reducers/themeReducer'
import { routerMiddleware } from 'connected-react-router'
import debug from 'debug'
import { remote } from 'electron'
import { applyMiddleware, createStore as reduxCreateStore, DeepPartial, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { CoreState, createRootReducer, ElectronAction, ElectronState } from '../reducers'
import { navMiddleware } from './navMiddleware'
import { themeMiddleware, updateThemeVariables } from './themeMiddleware'

const log = debug('electron:electronStore')

const getPlatform = (): PlatformName => {
  switch (remote.process.platform) {
    case 'darwin':
      return 'mac'

    default:
      // return 'mac'
      return 'pc'
  }
}

export const getInitialState = (): DeepPartial<ElectronState> => {
  const theme: ThemeState = {
    ...initialThemeState,
    platform: getPlatform(),
    mode: remote.systemPreferences.isDarkMode() ? 'dark' : 'light',
    color: '#' + remote.systemPreferences.getAccentColor(),
  }

  updateThemeVariables(theme.color, theme.mode)

  const locale = remote.app.getLocale()
  const intl = intlStateFromLocale(locale)

  return { theme, intl }
}

export const createStore = (hist: HistoryType, dependencies: CoreDependencies) => {
  const middleware: Array<Middleware<CoreDependencies, CoreState, CoreDispatch>> = [
    thunk.withExtraArgument(dependencies),
    routerMiddleware(hist),
    navMiddleware,
    themeMiddleware,
  ]

  const initialState = getInitialState()
  // log('initialState %o', initialState)

  const store = reduxCreateStore<ElectronState, ElectronAction, {}, {}>(
    createRootReducer(hist),
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  )

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../reducers', () => {
      log('reducers updated')
      store.replaceReducer(createRootReducer(hist))
    })
  }

  return store
}
