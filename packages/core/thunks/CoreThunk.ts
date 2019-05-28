import { ThunkAction } from 'redux-thunk'
import { CoreAction } from '../actions'
import { CoreDependencies } from '../context'
import { CoreState } from '../reducers'

export type CoreThunk<X = void> = ThunkAction<Promise<X>, CoreState, CoreDependencies, CoreAction>
