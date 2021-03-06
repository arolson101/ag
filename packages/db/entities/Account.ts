import { ImageId } from '@ag/core/context'
import { ISpec } from '@ag/util'
import { CurrencyCode } from 'currency-code-map'
import * as R from 'ramda'
import randomColor from 'randomcolor'
import { defineMessages } from 'react-intl'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AccountType } from './AccountType'
import { DbChange } from './DbChange'
import { DbEntity, DbEntityKeys } from './DbEntity'

@Entity({ name: 'accounts' })
export class Account extends DbEntity<Account.Props> {
  @PrimaryColumn() id!: string
  @Column() bankId!: string

  @Column() name!: string
  @Column() color!: string
  @Column('text') type!: AccountType
  @Column() number!: string
  @Column() visible!: boolean
  @Column() routing!: string
  @Column() key!: string
  @Column('text') iconId!: ImageId
  @Column() sortOrder!: number
  @Column('text') currencyCode!: CurrencyCode
  @Column({ default: 0 }) balance!: number
}

export namespace Account {
  export interface Props extends Omit<Account, DbEntityKeys> {}
  export const Type = AccountType
  export type Type = AccountType
  export type Spec = ISpec<Props>

  export const iconSize = 128
  export const defaultCurrencyCode: CurrencyCode = 'USD'

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

  export const generateColor = (type?: Type, seed?: number): string => {
    switch (type) {
      case Type.CHECKING:
        return randomColor({ hue: 'red', luminosity: 'bright', seed }) as string
      case Type.SAVINGS:
        return randomColor({ hue: 'green', luminosity: 'bright', seed }) as string
      case Type.MONEYMRKT:
        return randomColor({ hue: 'purple', luminosity: 'bright', seed }) as string
      case Type.CREDITLINE:
        return randomColor({ hue: 'blue', luminosity: 'bright', seed }) as string
      case Type.CREDITCARD:
        return randomColor({ hue: 'orange', luminosity: 'bright', seed }) as string

      default:
        return randomColor({ luminosity: 'bright', seed }) as string
    }
  }

  export const defaultValues = () => ({
    name: '',
    type: Type.CHECKING,
    color: generateColor(Type.CHECKING),
    number: '',
    visible: true,
    routing: '',
    key: '',
    sortOrder: -1,
    iconId: '' as ImageId,
    currencyCode: defaultCurrencyCode as CurrencyCode,
    balance: 0,
  })

  export const keys = R.keys(defaultValues())

  export namespace change {
    export const add = (t: number, ...accounts: Account[]): DbChange => ({
      table: 'account',
      t,
      adds: accounts,
    })

    export const edit = (t: number, id: string, q: Spec): DbChange => ({
      table: 'account',
      t,
      edits: [{ id, q }],
    })

    export const remove = (t: number, id: string): DbChange => ({
      table: 'account',
      t,
      deletes: [id],
    })

    export const addTx = (t: number, id: string, amount: number | undefined): DbChange[] => {
      if (!amount) {
        return []
      }
      const q: Spec = { balance: { $plus: amount } }
      return [
        {
          table: 'account',
          t,
          edits: [{ id, q }],
        },
      ]
    }
  }
}
