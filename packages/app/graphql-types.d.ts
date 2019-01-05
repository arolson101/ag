export type Maybe<T> = T | null

export enum AccountType {
  Checking = 'CHECKING',
  Savings = 'SAVINGS',
  Moneymrkt = 'MONEYMRKT',
  Creditline = 'CREDITLINE',
  Creditcard = 'CREDITCARD',
}

/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
export type DateTime = any

// ====================================================
// Documents
// ====================================================

export type LoginPageVariables = {}

export type LoginPageQuery = {
  __typename?: 'Query'

  allDbs: LoginPageAllDbs[]
}

export type LoginPageAllDbs = {
  __typename?: 'DbInfo'

  dbId: string

  name: string
}
