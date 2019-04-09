import { ISpec } from '@ag/util'
import randomColor from 'randomcolor'
import { defineMessages } from 'react-intl'
import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AccountInput } from './AccountInput'
import { AccountType } from './AccountType'
import { DbChange } from './DbChange'
import { Record } from './Record'

@ObjectType()
@Entity({ name: 'accounts' })
export class Account extends Record<Account.Props> {
  @PrimaryColumn() @Field() id!: string
  @Column() @Field() bankId!: string

  @Column() @Field() name!: string
  @Column() @Field() color!: string
  @Column('text') @Field(type => AccountType) type!: AccountType
  @Column() @Field() number!: string
  @Column() @Field() visible!: boolean
  @Column() @Field() routing!: string
  @Column() @Field() key!: string
  @Column() @Field() sortOrder!: number

  constructor(bankId?: string, id?: string, props?: AccountInput) {
    super(id, { ...Account.defaultValues(), ...props })
    if (bankId) {
      this.bankId = bankId
    }
  }
}

export namespace Account {
  export interface Props extends Pick<Required<AccountInput>, keyof AccountInput> {}
  export const Type = AccountType
  export type Type = AccountType
  export type Spec = ISpec<Props>

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

  export namespace change {
    export const add = (t: number, ...accounts: Account[]): DbChange => ({
      table: Account,
      t,
      adds: accounts,
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: Account,
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: Account,
      t,
      deletes: [id],
    })
  }

  export const defaultValues = (): Props => ({
    name: '',
    type: Type.CHECKING,
    color: generateColor(Type.CHECKING),
    number: '',
    visible: true,
    routing: '',
    key: '',
    sortOrder: -1,
  })
}
