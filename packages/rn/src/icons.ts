import debug from 'debug'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const log = debug('rn:navigation')
log.enabled = true

const tabSize = 24

type iconNames = keyof typeof iconSource

// https://fontawesome.com/icons?d=gallery&m=free
const iconSource = {
  accounts: 'university',
  home: 'home',
  bills: 'money-check-alt',
  budgets: 'piggy-bank',
  calendar: 'calendar-alt',
}

export const icons: Record<iconNames, any> = {} as any

const getIcons = async () => {
  const promises = (Object.keys(iconSource) as iconNames[]).map(async name => {
    const val = await FontAwesome5.getImageSource(iconSource[name], tabSize)
    icons[name] = val
  })
  await Promise.all(promises)
}

export const fontInit = getIcons()
