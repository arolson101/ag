import { ThunkAction } from 'redux-thunk'
import { accountThunks } from './accountThunks'
import { dbThunks } from './dbThunks'
import { initThunk } from './initThunk'
import { settingsThunks } from './settingsThunks'

export const thunks = {
  ...initThunk,
  ...dbThunks,
  ...settingsThunks,
  ...accountThunks,
}

type ThunkActionType<M extends any> = {
  [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
    ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
    : M[N]
}

export type CoreThunkAction = ThunkActionType<typeof thunks>
