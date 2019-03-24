import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { ResponseMessage } from '../ResponseMessage'
import { AccountProfile } from './AccountProfile'

export class AccountInfoResponse extends ResponseMessage {
  private lastUpdated: Date
  private accounts!: AccountProfile[]

  constructor() {
    super()
    this.lastUpdated = new Date(0) // default is never updated.
  }

  getResponseMessageName(): string {
    return 'account info'
  }

  /**
   * When the account info was last updated.
   *
   * @return When the account info was last updated.
   */
  getLastUpdated(): Date {
    return this.lastUpdated
  }

  /**
   * When the account info was last updated.
   *
   * @param lastUpdated When the account info was last updated.
   */
  setLastUpdated(lastUpdated: Date): void {
    this.lastUpdated = lastUpdated
  }

  /**
   * The accounts.
   *
   * @return The accounts.
   */
  getAccounts(): AccountProfile[] {
    return this.accounts
  }

  /**
   * The accounts.
   *
   * @param accounts The accounts.
   */
  setAccounts(accounts: AccountProfile[]): void {
    this.accounts = accounts
  }
}

Aggregate_add(AccountInfoResponse, 'ACCTINFORS')
Element_add(AccountInfoResponse, {
  name: 'DTACCTUP',
  required: true,
  order: 0,
  type: Date,
  read: AccountInfoResponse.prototype.getLastUpdated,
  write: AccountInfoResponse.prototype.setLastUpdated,
})
ChildAggregate_add(AccountInfoResponse, {
  order: 10,
  type: Array,
  collectionEntryType: AccountProfile,
  read: AccountInfoResponse.prototype.getAccounts,
  write: AccountInfoResponse.prototype.setAccounts,
})
