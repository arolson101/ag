import { ISpec } from '@ag/util/iupdate'
import randomColor from 'randomcolor'
import { defineMessages } from 'react-intl'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AccountInput, AccountType } from './AccountInput'
import { Record } from './Record'

@ObjectType()
@Entity({ name: 'accounts' })
export class Account extends Record<Account.Props> {
  @PrimaryColumn() @Field() id!: string
  @Column() @Field() bankId!: string

  @Column() @Field() name!: string
  @Column() @Field() color!: string
  @Column() @Field(type => AccountType) @Column() type!: AccountType
  @Column() @Field() number!: string
  @Column() @Field() visible!: boolean
  @Column() @Field() routing!: string
  @Column() @Field() key!: string

  constructor(genId?: () => string, bankId?: string, props?: AccountInput) {
    super(genId, { ...Account.defaultValues(), ...props })
    if (bankId) {
      this.bankId = bankId
    }
  }
}

export namespace Account {
  export interface Props extends Pick<AccountInput, keyof AccountInput> {}
  export const Type = AccountType
  export type Type = AccountType
  export type Spec = ISpec<AccountInput>

  export const messages = defineMessages({
    CHECKING: {
      id: 'Account.Type.CHECKING',
      defaultMessage: 'Checking',
    },
    SAVINGS: {
      id: 'Account.Type.SAVINGS',
      defaultMessage: 'Savings',
    },
    MONEYMRKT: {
      id: 'Account.Type.MONEYMRKT',
      defaultMessage: 'Money Market',
    },
    CREDITLINE: {
      id: 'Account.Type.CREDITLINE',
      defaultMessage: 'Credit Line',
    },
    CREDITCARD: {
      id: 'Account.Type.CREDITCARD',
      defaultMessage: 'Credit Card',
    },
  })

  export const generateColor = (type?: Type): string => {
    switch (type) {
      case Type.CHECKING:
        return randomColor({ hue: 'red', luminosity: 'bright' })
      case Type.SAVINGS:
        return randomColor({ hue: 'green', luminosity: 'bright' })
      case Type.MONEYMRKT:
        return randomColor({ hue: 'purple', luminosity: 'bright' })
      case Type.CREDITLINE:
        return randomColor({ hue: 'blue', luminosity: 'bright' })
      case Type.CREDITCARD:
        return randomColor({ hue: 'orange', luminosity: 'bright' })

      default:
        return randomColor({ luminosity: 'bright' })
    }
  }

  // export namespace change {
  //   export const add = (t: number, ...accounts: Interface[]): DbChange => ({
  //     table: Account,
  //     t,
  //     adds: accounts,
  //   })

  //   export const edit = (t: number, id: string, q: Query): DbChange => ({
  //     table: Account,
  //     t,
  //     edits: [{ id, q }],
  //   })

  //   export const remove = (t: number, id: string): DbChange => ({
  //     table: Account,
  //     t,
  //     deletes: [id],
  //   })
  // }

  export const defaultValues = (): Props => ({
    name: '',
    type: Type.CHECKING,
    color: generateColor(Type.CHECKING),
    number: '',
    visible: true,
    routing: '',
    key: '',
  })

  type Nullable<T> = { [K in keyof T]?: T[K] | undefined | null }

  // export const diff = (account: Account, values: Nullable<Props>): Query => {
  //   return Object.keys(values).reduce(
  //     (q, prop): Query => {
  //       const val = values[prop]
  //       if (val !== account[prop]) {
  //         return {
  //           ...q,
  //           [prop]: { $set: val },
  //         }
  //       } else {
  //         return q
  //       }
  //     },
  //     {} as Query
  //   )
  // }
}
