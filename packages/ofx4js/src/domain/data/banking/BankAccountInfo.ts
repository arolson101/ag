import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { AccountDetails } from '../common/AccountDetails'
import { AccountInfo } from '../common/AccountInfo'
import { AccountStatus } from '../common/AccountStatus'
import { BankAccountDetails } from './BankAccountDetails'

export class BankAccountInfo implements AccountInfo {
  private bankAccount!: BankAccountDetails
  private supportsTransactionDetailOperations!: boolean
  private supportsTransferToOtherAccountOperations!: boolean
  private supportsTransferFromOtherAccountOperations!: boolean
  private status!: AccountStatus

  /**
   * The bank account this information is referencing.
   *
   * @return The bank account this information is referencing.
   */
  getBankAccount(): BankAccountDetails {
    return this.bankAccount
  }

  /**
   * The bank account this information is referencing.
   *
   * @param bankAccount The bank account this information is referencing.
   */
  setBankAccount(bankAccount: BankAccountDetails): void {
    this.bankAccount = bankAccount
  }

  // Inherited.
  getAccountDetails(): AccountDetails {
    return this.getBankAccount()
  }

  /**
   * Whether this account supports download of transaction details.
   *
   * @return Whether this account supports download of transaction details.
   */
  getSupportsTransactionDetailOperations(): boolean {
    return this.supportsTransactionDetailOperations
  }

  /**
   * Whether this account supports download of transaction details.
   *
   * @param supportsTransactionDetailOperations Whether this account supports
   * download of transaction details.
   */
  setSupportsTransactionDetailOperations(supportsTransactionDetailOperations: boolean): void {
    this.supportsTransactionDetailOperations = supportsTransactionDetailOperations
  }

  /**
   * Whether this account supports transfer operations to other accounts.
   *
   * @return Whether this account supports transfer operations to other accounts.
   */
  getSupportsTransferToOtherAccountOperations(): boolean {
    return this.supportsTransferToOtherAccountOperations
  }

  /**
   * Whether this account supports transfer operations to other accounts.
   *
   * @param supportsTransferToOtherAccountOperations Whether this account supports transfer
   * operations to other accounts.
   */
  setSupportsTransferToOtherAccountOperations(
    supportsTransferToOtherAccountOperations: boolean
  ): void {
    this.supportsTransferToOtherAccountOperations = supportsTransferToOtherAccountOperations
  }

  /**
   * Whether this account supports transfer operations from other accounts.
   *
   * @return Whether this account supports transfer operations from other accounts.
   */
  getSupportsTransferFromOtherAccountOperations(): boolean {
    return this.supportsTransferFromOtherAccountOperations
  }

  /**
   * Whether this account supports transfer operations from other accounts.
   *
   * @param supportsTransferFromOtherAccountOperations Whether this account supports transfer
   * operations from other accounts.
   */
  setSupportsTransferFromOtherAccountOperations(
    supportsTransferFromOtherAccountOperations: boolean
  ): void {
    this.supportsTransferFromOtherAccountOperations = supportsTransferFromOtherAccountOperations
  }

  /**
   * The account status.
   *
   * @return The account status.
   */
  getStatus(): AccountStatus {
    return this.status
  }

  /**
   * The account status.
   *
   * @param status The account status.
   */
  setStatus(status: AccountStatus): void {
    this.status = status
  }
}

Aggregate_add(BankAccountInfo, 'BANKACCTINFO')
ChildAggregate_add(BankAccountInfo, {
  name: 'BANKACCTFROM',
  required: true,
  order: 0,
  type: BankAccountDetails,
  read: BankAccountInfo.prototype.getBankAccount,
  write: BankAccountInfo.prototype.setBankAccount,
})
Element_add(BankAccountInfo, {
  name: 'SUPTXDL',
  required: true,
  order: 10,
  type: Boolean,
  read: BankAccountInfo.prototype.getSupportsTransactionDetailOperations,
  write: BankAccountInfo.prototype.setSupportsTransactionDetailOperations,
})
Element_add(BankAccountInfo, {
  name: 'XFERSRC',
  required: true,
  order: 20,
  type: Boolean,
  read: BankAccountInfo.prototype.getSupportsTransferToOtherAccountOperations,
  write: BankAccountInfo.prototype.setSupportsTransferToOtherAccountOperations,
})
Element_add(BankAccountInfo, {
  name: 'XFERDEST',
  required: true,
  order: 30,
  type: Boolean,
  read: BankAccountInfo.prototype.getSupportsTransferFromOtherAccountOperations,
  write: BankAccountInfo.prototype.setSupportsTransferFromOtherAccountOperations,
})
Element_add(BankAccountInfo, {
  name: 'SVCSTATUS',
  required: true,
  order: 40,
  type: AccountStatus,
  read: BankAccountInfo.prototype.getStatus,
  write: BankAccountInfo.prototype.setStatus,
})
