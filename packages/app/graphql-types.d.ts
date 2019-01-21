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

export namespace IsLoggedIn {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    loggedIn: boolean
  }
}

export namespace HomePage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    banks: Banks[]
  }

  export type Banks = {
    __typename?: 'Bank'

    id: string

    name: string

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    name: string
  }
}

export namespace Dbs {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    dbs: Dbs[]
  }

  export type Dbs = {
    __typename?: 'Db'

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
