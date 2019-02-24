import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export { gql }

export interface Gql<TData, TVariables> extends DocumentNode {
  __dataType?: TData
  __variableType?: TVariables
}
