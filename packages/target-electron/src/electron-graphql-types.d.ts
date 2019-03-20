// tslint:disable all
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

export namespace SidebarWidth {
  export type Variables = {}

  export type Query = {
    __typename?: 'Query'

    appDb: Maybe<AppDb>
  }

  export type AppDb = {
    __typename?: 'AppDb'

    get: Maybe<Get>
  }

  export type Get = {
    __typename?: 'Setting'

    key: string

    value: string
  }
}

export namespace SetSidebarWidth {
  export type Variables = {
    value: string
  }

  export type Mutation = {
    __typename?: 'Mutation'

    set: Maybe<Set>
  }

  export type Set = {
    __typename?: 'Setting'

    key: string

    value: string
  }
}
