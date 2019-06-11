import { ImageUri, ISpec } from '@ag/util'
import randomColor from 'randomcolor'
import { defineMessages } from 'react-intl'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AccountInput } from './AccountInput'
import { AccountType } from './AccountType'
import { DbChange } from './DbChange'
import { Record } from './Record'

@Entity({ name: 'accounts' })
export class Account extends Record<Account.Props> {
  @PrimaryColumn() id!: string
  @Column() bankId!: string

  @Column() name!: string
  @Column() color!: string
  @Column('text') type!: AccountType
  @Column() number!: string
  @Column() visible!: boolean
  @Column() routing!: string
  @Column() key!: string
  @Column('text') icon!: ImageUri
  @Column() sortOrder!: number

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
        return randomColor({ hue: 'red', luminosity: 'bright' }) as string
      case Type.SAVINGS:
        return randomColor({ hue: 'green', luminosity: 'bright' }) as string
      case Type.MONEYMRKT:
        return randomColor({ hue: 'purple', luminosity: 'bright' }) as string
      case Type.CREDITLINE:
        return randomColor({ hue: 'blue', luminosity: 'bright' }) as string
      case Type.CREDITCARD:
        return randomColor({ hue: 'orange', luminosity: 'bright' }) as string

      default:
        return randomColor({ luminosity: 'bright' }) as string
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
    icon: '',
  })
}
