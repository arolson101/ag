export type Maybe<T> = T | null

export interface BankInput {
  name?: Maybe<string>

  web?: Maybe<string>

  address?: Maybe<string>

  notes?: Maybe<string>

  favicon?: Maybe<string>

  online?: Maybe<boolean>

  fid?: Maybe<string>

  org?: Maybe<string>

  ofx?: Maybe<string>

  username?: Maybe<string>

  password?: Maybe<string>
}

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

export namespace BankForm {
  export type Variables = {
    bankId?: Maybe<string>
  }

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    bank: Maybe<Bank>
  }

  export type Bank = {
    __typename?: 'Bank'

    name: string

    web: string

    address: string

    notes: string

    favicon: string

    online: boolean

    fid: string

    org: string

    ofx: string

    username: string

    password: string
  }
}

export namespace SaveBank {
  export type Variables = {
    input: BankInput
    bankId?: Maybe<string>
  }

  export type Mutation = {
    __typename?: 'Mutation'

    saveBank: SaveBank
  }

  export type SaveBank = {
    __typename?: 'Bank'

    id: string

    name: string
  }
}

export namespace DeleteBank {
  export type Variables = {
    bankId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    deleteBank: boolean
  }
}

export namespace LoginForm {
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
