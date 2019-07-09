import { ThunkAction } from 'redux-thunk'
import { accountThunks } from './accountThunks'
import { bankThunks } from './bankThunks'
import { billThunks } from './billThunks'
import { dbThunks } from './dbThunks'
import { initThunk } from './initThunk'
import { settingsThunks } from './settingsThunks'
import { transactionThunks } from './transactionThunks'

export const thunks = {
  ...initThunk,
  ...dbThunks,
  ...settingsThunks,
  ...bankThunks,
  ...billThunks,
  ...accountThunks,
  ...transactionThunks,
}

type ThunkActionType<M extends any> = {
  [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
    ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
    : M[N]
}

export type CoreThunkAction = ThunkActionType<typeof thunks>
