import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../../meta/ChildAggregate_Add'
import { Element_add } from '../../../../meta/Element_add'
import { SecurityId } from '../../seclist/SecurityId'
import { SubAccountType, SubAccountType_fromOfx } from '../accounts/SubAccountType'
import { BaseOtherInvestmentTransaction } from './BaseOtherInvestmentTransaction'
import { InvestmentTransactionType } from './TransactionType'
import { TransactionWithSecurity } from './TransactionWithSecurity'

/**
 * Transaction for journal security transactions between sub-accounts within the same investment
 * account.
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class JournalSecurityTransaction extends BaseOtherInvestmentTransaction
  implements TransactionWithSecurity {
  private securityId!: SecurityId
  private subAccountFrom!: string
  private subAccountTo!: string
  private total!: number

  constructor() {
    super(InvestmentTransactionType.JOURNAL_SECURITY)
  }

  /**
   * Gets the id of the security that was transferred. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @return the security id of the security that was bought
   */
  getSecurityId(): SecurityId {
    return this.securityId
  }

  /**
   * Sets the id of the security that was transferred. This is a required field according to the OFX
   * spec.
   * @see "Section 13.9.2.4.3, OFX Spec"
   *
   * @param securityId the security id of the security that was bought
   */
  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
  }

  /**
   * Gets the sub account type the transer is from (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the sub account type
   */
  getFromSubAccountFund(): string {
    return this.subAccountFrom
  }

  /**
   * Sets the sub account type the transer is from (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param subAccountFrom the sub account type
   */
  setFromSubAccountFund(subAccountFrom: string): void {
    this.subAccountFrom = subAccountFrom
  }

  /**
   * Gets the result of getFromSubAccountFund as one of the well-known types.
   *
   * @return the type of null if it wasn't one of the well known types.
   */
  getFromSubAccountFundEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getFromSubAccountFund())
  }

  /**
   * Gets the sub account type that the transfer is to (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the sub account fund
   */
  getToSubAccountFund(): string {
    return this.subAccountTo
  }

  /**
   * sets the sub account type that the transfer is to (e.g. CASH, MARGIN, SHORT, OTHER).
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param subAccountTo the sub account fund
   */
  setToSubAccountFund(subAccountTo: string): void {
    this.subAccountTo = subAccountTo
  }

  /**
   * Gets the result of getToSubAccountFund as one of the well-known types.
   *
   * @return the type of null if it wasn't one of the well known types.
   */
  getToSubAccountFundEnum(): SubAccountType {
    return SubAccountType_fromOfx(this.getToSubAccountFund())
  }

  /**
   * Gets the total for the transaction.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the total
   */
  getTotal(): number {
    return this.total
  }

  /**
   * Sets the total for the transaction.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param total the total
   */
  setTotal(total: number): void {
    this.total = total
  }
}

Aggregate_add(JournalSecurityTransaction, 'JRNLSEC')
ChildAggregate_add(JournalSecurityTransaction, {
  required: true,
  order: 20,
  type: SecurityId,
  read: JournalSecurityTransaction.prototype.getSecurityId,
  write: JournalSecurityTransaction.prototype.setSecurityId,
})
Element_add(JournalSecurityTransaction, {
  name: 'SUBACCTFROM',
  order: 30,
  type: String,
  read: JournalSecurityTransaction.prototype.getFromSubAccountFund,
  write: JournalSecurityTransaction.prototype.setFromSubAccountFund,
})
Element_add(JournalSecurityTransaction, {
  name: 'SUBACCTTO',
  order: 40,
  type: String,
  read: JournalSecurityTransaction.prototype.getToSubAccountFund,
  write: JournalSecurityTransaction.prototype.setToSubAccountFund,
})
Element_add(JournalSecurityTransaction, {
  name: 'TOTAL',
  order: 50,
  type: Number,
  read: JournalSecurityTransaction.prototype.getTotal,
  write: JournalSecurityTransaction.prototype.setTotal,
})
