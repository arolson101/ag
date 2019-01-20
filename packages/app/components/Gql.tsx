import { DocumentNode } from 'graphql'

export interface Gql<TData, TVariables> extends DocumentNode {
  __dataType?: TData
  __variableType?: TVariables
}
