import { CancelToken } from 'axios'
import { InjectedIntl } from 'react-intl'
import { checkLogin, ofxService } from './ofxService'
import { Login, OfxServerInfo } from './ofxTypes'

export const getAccountList = async (
  login: Login,
  serverInfo: OfxServerInfo,
  cancelToken: CancelToken,
  intl: InjectedIntl
) => {
  const service = ofxService({ serverInfo, cancelToken, intl })
  const { username, password } = checkLogin({ login, intl })
  const accountProfiles = await service.readAccountProfiles(username, password)
  return accountProfiles
}
