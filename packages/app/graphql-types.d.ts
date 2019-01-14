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

export namespace LoginPage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    allDbs: AllDbs[]
  }

  export type AllDbs = {
    __typename?: 'DbInfo'

    dbId: string

    name: string
  }
}

export namespace CreateDb {
  export type Variables = {
    name: string
    password: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    createDb: boolean
  }
}

export namespace OpenDb {
  export type Variables = {
    dbId: string
    password: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    openDb: boolean
  }
}

export namespace DeleteDb {
  export type Variables = {
    dbId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    deleteDb: string
  }
}
