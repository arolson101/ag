import debug from 'debug'
import * as rnn from 'react-native-navigation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const log = debug('rn:navigation')
log.enabled = true

type iconNames = 'bank'

const iconSource: Record<iconNames, string> = {
  bank: 'university',
}

export const icons: Record<iconNames, any> = {} as any

const getIcons = async () => {
  const constants = await rnn.Navigation.constants()
  log('constants: %o', constants)
  // const bottomTabsHeight = constants.bottomTabsHeight;
  const promises = (Object.keys(iconSource) as iconNames[]).map(async name => {
    const val = await FontAwesome5.getImageSource(iconSource[name], 24)
    icons[name] = val
  })
  await Promise.all(promises)
}

export const fontInit = getIcons()
