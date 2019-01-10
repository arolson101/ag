import { LoginPageQuery } from '../graphql-types'
import { AppState, selectors } from '../reducers'

export namespace LoginPageForm {
  export interface Values {
    name: string
    dbId: string
    password: string
    passwordConfirm?: string
  }

  export const initalValues: Values = {
    name: 'appdb',
    dbId: '',
    password: '',
    passwordConfirm: '',
  }

  export const getDbId = (state: AppState) => {
    const data = selectors.getLoadData<LoginPageQuery>(state)
    return data.allDbs.length ? data.allDbs[0].dbId : ''
  }
}
