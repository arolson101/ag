import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { Element_add } from '../../../meta/Element_add'
import { AccountDetails } from '../common/AccountDetails'
import { AccountType } from './AccountType'

/**
 * Base bank account details.
 *
 * @see "OFX Spec, Section 11.3.1"
 */
export class BankAccountDetails implements AccountDetails {
  private bankId: string
  private branchId: string
  private accountNumber: string
  private accountType: AccountType
  private accountKey: string

  /**
   * The routing and transit number.
   *
   * @return The routing and transit number.
   */
  getBankId(): string {
    return this.bankId
  }

  /**
   * The routing and transit number.
   *
   * @param bankId The routing and transit number.
   */
  setBankId(bankId: string): void {
    this.bankId = bankId
  }

  /**
   * The routing and transit number.
   *
   * @return The routing and transit number.
   */
  getRoutingNumber(): string {
    return this.getBankId()
  }

  /**
   * The routing and transit number.
   *
   * @param routingNumber The routing and transit number.
   */
  setRoutingNumber(routingNumber: string): void {
    this.setBankId(routingNumber)
  }

  /**
   * The branch id.
   *
   * @return The branch id.
   */
  getBranchId(): string {
    return this.branchId
  }

  /**
   * The branch id.
   *
   * @param branchId The branch id.
   */
  setBranchId(branchId: string): void {
    this.branchId = branchId
  }

  /**
   * The account number.
   *
   * @return The account number.
   */
  getAccountNumber(): string {
    return this.accountNumber
  }

  /**
   * The account number.
   *
   * @param accountNumber The account number.
   */
  setAccountNumber(accountNumber: string): void {
    this.accountNumber = accountNumber
  }

  /**
   * The account type.
   *
   * @return The account type.
   */
  getAccountType(): AccountType {
    return this.accountType
  }

  /**
   * The account type.
   *
   * @param accountType The account type.
   */
  setAccountType(accountType: AccountType): void {
    this.accountType = accountType
  }

  /**
   * The account key.
   *
   * @return The account key.
   */
  getAccountKey(): string {
    return this.accountKey
  }

  /**
   * The account key.
   *
   * @param accountKey The account key.
   */
  setAccountKey(accountKey: string): void {
    this.accountKey = accountKey
  }
}

Aggregate_add(BankAccountDetails)
Element_add(BankAccountDetails, {
  name: 'BANKID',
  required: true,
  order: 0,
  type: String,
  read: BankAccountDetails.prototype.getBankId,
  write: BankAccountDetails.prototype.setBankId,
})
Element_add(BankAccountDetails, {
  name: 'BRANCHID',
  order: 10,
  type: String,
  read: BankAccountDetails.prototype.getBranchId,
  write: BankAccountDetails.prototype.setBranchId,
})
Element_add(BankAccountDetails, {
  name: 'ACCTID',
  required: true,
  order: 20,
  type: String,
  read: BankAccountDetails.prototype.getAccountNumber,
  write: BankAccountDetails.prototype.setAccountNumber,
})
Element_add(BankAccountDetails, {
  name: 'ACCTTYPE',
  required: true,
  order: 30,
  type: AccountType,
  read: BankAccountDetails.prototype.getAccountType,
  write: BankAccountDetails.prototype.setAccountType,
})
Element_add(BankAccountDetails, {
  name: 'ACCTKEY',
  order: 40,
  type: String,
  read: BankAccountDetails.prototype.getAccountKey,
  write: BankAccountDetails.prototype.setAccountKey,
})
