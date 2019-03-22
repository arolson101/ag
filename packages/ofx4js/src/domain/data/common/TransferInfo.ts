import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { OFXException } from '../../../OFXException'
import { BankAccountDetails } from '../banking/BankAccountDetails'
import { CreditCardAccountDetails } from '../creditcard/CreditCardAccountDetails'

export class TransferInfo {
  private bankAccountFrom: BankAccountDetails
  private creditCardAccountFrom: CreditCardAccountDetails
  private bankAccountTo: BankAccountDetails
  private creditCardAccountTo: CreditCardAccountDetails

  private amount: number
  private due: Date

  /**
   * The bank account to transfer from.
   *
   * @return The bank account to transfer from.
   */
  getBankAccountFrom(): BankAccountDetails {
    return this.bankAccountFrom
  }

  /**
   * The bank account to transfer from.
   *
   * @param bankAccountFrom The bank account to transfer from.
   */
  setBankAccountFrom(bankAccountFrom: BankAccountDetails): void {
    this.creditCardAccountFrom = null
    this.bankAccountFrom = bankAccountFrom
  }

  /**
   * The account to transfer from.
   *
   * @param acct The account to transfer from.
   */
  setAccountFrom(acct: BankAccountDetails | CreditCardAccountDetails): void {
    if (acct instanceof BankAccountDetails) {
      this.setBankAccountFrom(acct as BankAccountDetails)
    } else {
      this.setCreditCardAccountFrom(acct as CreditCardAccountDetails)
    }
  }

  /**
   * The credit card to transfer from.
   *
   * @return The credit card to transfer from.
   */
  getCreditCardAccountFrom(): CreditCardAccountDetails {
    return this.creditCardAccountFrom
  }

  /**
   * The credit card to transfer from.
   *
   * @param creditCardAccountFrom The credit card to transfer from.
   */
  setCreditCardAccountFrom(creditCardAccountFrom: CreditCardAccountDetails): void {
    this.bankAccountFrom = null
    this.creditCardAccountFrom = creditCardAccountFrom
  }

  /**
   * The bank account to transfer to.
   *
   * @return The bank account to transfer to.
   */
  getBankAccountTo(): BankAccountDetails {
    return this.bankAccountTo
  }

  /**
   * The bank account to transfer to.
   *
   * @param bankAccountTo The bank account to transfer to.
   */
  setBankAccountTo(bankAccountTo: BankAccountDetails): void {
    this.creditCardAccountTo = null
    this.bankAccountTo = bankAccountTo
  }

  /**
   * The bank or credit card account to transfer to.
   *
   * @param accountTo The account to transfer to.
   */
  setAccountTo(accountTo: BankAccountDetails | CreditCardAccountDetails): void {
    if (accountTo instanceof BankAccountDetails) {
      this.setBankAccountTo(accountTo)
    } else if (accountTo instanceof CreditCardAccountDetails) {
      this.setCreditCardAccountTo(accountTo)
    } else {
      throw new OFXException('invalid type')
    }
  }

  /**
   * The credit card account to transfer to.
   *
   * @return The credit card account to transfer to.
   */
  getCreditCardAccountTo(): CreditCardAccountDetails {
    return this.creditCardAccountTo
  }

  /**
   * The credit card account to transfer to.
   *
   * @param creditCardAccountTo The credit card account to transfer to.
   */
  setCreditCardAccountTo(creditCardAccountTo: CreditCardAccountDetails): void {
    this.bankAccountTo = null
    this.creditCardAccountTo = creditCardAccountTo
  }

  /**
   * The amount.
   *
   * @return The amount.
   */
  getAmount(): number {
    return this.amount
  }

  /**
   * The amount.
   *
   * @param amount The amount.
   */
  setAmount(amount: number): void {
    this.amount = amount
  }

  /**
   * The due date.
   *
   * @return The due date.
   */
  getDue(): Date {
    return this.due
  }

  /**
   * The due date.
   *
   * @param due The due date.
   */
  setDue(due: Date): void {
    this.due = due
  }
}

Aggregate_add(TransferInfo, 'XFERINFO')
ChildAggregate_add(TransferInfo, {
  name: 'BANKACCTFROM',
  order: 0,
  type: BankAccountDetails,
  read: TransferInfo.prototype.getBankAccountFrom,
  write: TransferInfo.prototype.setBankAccountFrom,
})
ChildAggregate_add(TransferInfo, {
  name: 'CCACCTFROM',
  order: 10,
  type: CreditCardAccountDetails,
  read: TransferInfo.prototype.getCreditCardAccountFrom,
  write: TransferInfo.prototype.setCreditCardAccountFrom,
})
ChildAggregate_add(TransferInfo, {
  name: 'BANKACCTTO',
  order: 20,
  type: BankAccountDetails,
  read: TransferInfo.prototype.getBankAccountTo,
  write: TransferInfo.prototype.setBankAccountTo,
})
ChildAggregate_add(TransferInfo, {
  name: 'CCACCTTO',
  order: 30,
  type: CreditCardAccountDetails,
  read: TransferInfo.prototype.getCreditCardAccountTo,
  write: TransferInfo.prototype.setCreditCardAccountTo,
})
Element_add(TransferInfo, {
  name: 'TRNAMT',
  required: true,
  order: 40,
  type: Number,
  read: TransferInfo.prototype.getAmount,
  write: TransferInfo.prototype.setAmount,
})
Element_add(TransferInfo, {
  name: 'DTDUE',
  order: 50,
  type: Date,
  read: TransferInfo.prototype.getDue,
  write: TransferInfo.prototype.setDue,
})
