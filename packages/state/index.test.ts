import { actions, configureStore, Services, selectors } from './index'

const services: Services = {
  logger: () => {},
}

describe('navigation state', () => {
  test('starts loading', async () => {
    const store = configureStore(services)
    let wasLoading = false
    store.subscribe(() => {
      if (selectors.isLoading(store.getState())) {
        wasLoading = true
      }
    })
    expect(selectors.isLoading(store.getState())).toBe(false)
    store.dispatch(actions.nav.home())
    await new Promise(resolve => setTimeout(resolve, 2000))
    expect(selectors.isLoading(store.getState())).toBe(false)
    expect(wasLoading).toBe(true)
  })
})
