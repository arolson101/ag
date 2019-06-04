// tslint:disable all
import { ImageUri } from '@ag/util'
export type Maybe<T> = T | null

export interface AccountInput {
  name?: Maybe<string>

  color?: Maybe<string>

  type?: Maybe<AccountType>

  number?: Maybe<string>

  visible?: Maybe<boolean>

  routing?: Maybe<string>

  key?: Maybe<string>

  icon?: Maybe<ImageUri>

  sortOrder?: Maybe<number>
}

export interface BankInput {
  name?: Maybe<string>

  web?: Maybe<string>

  address?: Maybe<string>

  notes?: Maybe<string>

  icon?: Maybe<ImageUri>

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

/** An image data URI */

/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
export type DateTime = any

// ====================================================
// Documents
// ====================================================

export namespace MenuBar {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    banks: Banks[]
  }

  export type Banks = {
    __typename?: 'Bank'

    id: string

    name: string

    icon: ImageUri

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

    icon: ImageUri

    web: string
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

export namespace Transaction {
  export type Variables = {
    transactionId?: Maybe<string>
  }

  export type Query = {
    __typename?: 'Query'

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

export namespace AccountPage {
  export type Variables = {
    accountId: string
  }

  export type Query = {
    __typename?: 'Query'

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

    icon: ImageUri
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

    banks: Banks[]
  }

  export type Banks = BankFieldsAccountsPage.Fragment
}

export namespace SetAccountsOrder {
  export type Variables = {
    accountIds: string[]
  }

  export type Mutation = {
    __typename?: 'Mutation'

    setAccountsOrder: boolean
  }
}

export namespace BillsPage {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

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

    sortOrder: number

    icon: ImageUri

    bank: Bank
  }

  export type Bank = {
    __typename?: 'Bank'

    name: string

    icon: ImageUri

    web: string
  }
}

export namespace BankFields {
  export type Fragment = {
    __typename?: 'Bank'

    name: string

    web: string

    address: string

    notes: string

    icon: ImageUri

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

    icon: ImageUri

    online: boolean

    accounts: Accounts[]
  }

  export type Accounts = {
    __typename?: 'Account'

    id: string

    icon: ImageUri

    name: string

    number: string

    visible: boolean

    sortOrder: number
  }
}

export namespace AccountFieldsAccountsPage {
  export type Fragment = {
    __typename?: 'Account'

    id: string

    bankId: string

    name: string

    icon: ImageUri

    color: string

    type: AccountType

    number: string

    visible: boolean

    routing: string

    key: string

    sortOrder: number
  }
}
