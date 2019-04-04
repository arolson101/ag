import { ImageSource } from '@ag/util'
export type Maybe<T> = T | null

export interface AccountInput {
  name?: Maybe<string>

  color?: Maybe<string>

  type?: Maybe<AccountType>

  number?: Maybe<string>

  visible?: Maybe<boolean>

  routing?: Maybe<string>

  key?: Maybe<string>
}

export interface BankInput {
  name?: Maybe<string>

  web?: Maybe<string>

  address?: Maybe<string>

  notes?: Maybe<string>

  favicon?: Maybe<ImageSource>

  online?: Maybe<boolean>

  fid?: Maybe<string>

  org?: Maybe<string>

  ofx?: Maybe<string>

  username?: Maybe<string>

  password?: Maybe<string>
}

export interface TransactionInput {
  account?: Maybe<string>

  serverid?: Maybe<string>

  time?: Maybe<DateTime>

  type?: Maybe<string>

  name?: Maybe<string>

  memo?: Maybe<string>

  amount?: Maybe<number>
}

export interface BillInput {
  name?: Maybe<string>

  group?: Maybe<string>

  web?: Maybe<string>

  favicon?: Maybe<string>

  notes?: Maybe<string>

  amount?: Maybe<number>

  account?: Maybe<string>

  category?: Maybe<string>

  rruleString?: Maybe<string>

  showAdvanced?: Maybe<boolean>
}

export interface BudgetInput {
  name?: Maybe<string>

  sortOrder?: Maybe<number>
}

export interface CategoryInput {
  name?: Maybe<string>

  amount?: Maybe<number>
}

import { AccountType } from '@ag/db'

export type AccountTypeValueMap = {
  CHECKING: AccountType
  SAVINGS: AccountType
  MONEYMRKT: AccountType
  CREDITLINE: AccountType
  CREDITCARD: AccountType
}

/** An object containing image data */

/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
export type DateTime = any

// ====================================================
// Documents
// ====================================================

export namespace MenuBar {
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

    favicon: ImageSource

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    name: string
  }
}

export namespace AccountForm {
  export type Variables = {
    accountId?: Maybe<string>
    bankId?: Maybe<string>
  }

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    account: Maybe<Account>

    bank: Maybe<Bank>
  }

  export type Account = {
    __typename?: 'Account'

    id: string
  } & AccountFieldsAccountForm.Fragment

  export type Bank = {
    __typename?: 'Bank'

    name: string
  }
}

export namespace SaveAccount {
  export type Variables = {
    input: AccountInput
    accountId?: Maybe<string>
    bankId?: Maybe<string>
  }

  export type Mutation = {
    __typename?: 'Mutation'

    saveAccount: SaveAccount
  }

  export type SaveAccount = {
    __typename?: 'Account'

    id: string
  } & AccountFieldsAccountForm.Fragment
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

  export type Bank = BankFields.Fragment
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
  } & BankFields.Fragment
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

export namespace Transaction {
  export type Variables = {
    transactionId?: Maybe<string>
  }

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    transaction: Maybe<Transaction>
  }

  export type Transaction = TransactionFields.Fragment
}

export namespace SaveTransaction {
  export type Variables = {
    input: TransactionInput
    transactionId?: Maybe<string>
    accountId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    saveTransaction: SaveTransaction
  }

  export type SaveTransaction = TransactionFields.Fragment
}

export namespace DeleteTransaction {
  export type Variables = {
    transactionId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    deleteTransaction: DeleteTransaction
  }

  export type DeleteTransaction = {
    __typename?: 'Transaction'

    accountId: string
  }
}

export namespace DeleteAccount {
  export type Variables = {
    accountId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    deleteAccount: boolean
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

export namespace DeleteDb {
  export type Variables = {
    dbId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    deleteDb: string
  }
}

export namespace AccountPage {
  export type Variables = {
    accountId: string
  }

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    account: Maybe<Account>
  }

  export type Account = {
    __typename?: 'Account'

    id: string

    name: string

    bank: Bank

    transactions: Transactions[]
  }

  export type Bank = {
    __typename?: 'Bank'

    name: string

    favicon: ImageSource
  }

  export type Transactions = {
    __typename?: 'Transaction'

    id: string

    time: DateTime

    account: string

    serverid: string

    type: string

    name: string

    memo: string

    amount: number

    balance: number
  }
}

export namespace AccountsPage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    banks: Banks[]
  }

  export type Banks = BankFieldsAccountsPage.Fragment
}

export namespace SyncAccounts {
  export type Variables = {
    bankId: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    syncAccounts: SyncAccounts
  }

  export type SyncAccounts = BankFieldsAccountsPage.Fragment
}

export namespace DownloadTransactions {
  export type Variables = {
    bankId: string
    accountId: string
    start: DateTime
    end: DateTime
    cancelToken: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    downloadTransactions: DownloadTransactions
  }

  export type DownloadTransactions = AccountFieldsAccountsPage.Fragment
}

export namespace BillsPage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    name: string
  }
}

export namespace BudgetsPage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    name: string
  }
}

export namespace CalendarPage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    name: string
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
  }
}

export namespace AccountFieldsAccountForm {
  export type Fragment = {
    __typename?: 'Account'

    bankId: string

    name: string

    type: AccountType

    color: string

    number: string

    visible: boolean

    routing: string

    key: string

    bank: Bank
  }

  export type Bank = {
    __typename?: 'Bank'

    name: string
  }
}

export namespace BankFields {
  export type Fragment = {
    __typename?: 'Bank'

    name: string

    web: string

    address: string

    notes: string

    favicon: ImageSource

    online: boolean

    fid: string

    org: string

    ofx: string

    username: string

    password: string
  }
}

export namespace TransactionFields {
  export type Fragment = {
    __typename?: 'Transaction'

    account: string

    serverid: string

    time: DateTime

    type: string

    name: string

    memo: string

    amount: number
  }
}

export namespace BankFieldsAccountsPage {
  export type Fragment = {
    __typename?: 'Bank'

    id: string

    name: string

    favicon: ImageSource

    online: boolean

    accountOrder: string[]

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    name: string

    number: string

    visible: boolean
  }
}

export namespace AccountFieldsAccountsPage {
  export type Fragment = {
    __typename?: 'Account'

    id: string

    bankId: string

    name: string

    color: string

    type: AccountType

    number: string

    visible: boolean

    routing: string

    key: string
  }
}
