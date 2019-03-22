import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { Element_add } from '../../../../meta/Element_add'
import { BaseBuyInvestmentTransaction } from './BaseBuyInvestmentTransaction'
import { BuyType, BuyType_fromOfx } from './BuyType'
import { InvestmentTransactionType } from './TransactionType'

/**
 * Transaction for buying mutual funds.
 * @see "Section 13.9.2.4.4, OFX Spec"
 */
export class BuyMutualFundTransaction extends BaseBuyInvestmentTransaction {
  private buyType: string
  private relatedTransactionId: string

  constructor() {
    super(InvestmentTransactionType.BUY_MUTUAL_FUND)
  }

  /**
   * Gets the type of purchase (i.e. "BUY" or "BUYTOCOVER"). This is a required field according to
   * the OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the buy type
   */
  getBuyType(): string {
    return this.buyType
  }

  /**
   * Sets the type of purchase (i.e. "BUY" or "BUYTOCOVER"). This is a required field according to
   * the OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param buyType the buy type
   */
  setBuyType(buyType: string): void {
    this.buyType = buyType
  }

  /**
   * Gets the buy type as one of the well-known types.
   *
   * @return the type of purchase or null if it's not known
   */
  getBuyTypeEnum(): BuyType {
    return BuyType_fromOfx(this.buyType)
  }

  /**
   * Gets any related transaction id for a mutual fund purchase (e.g. for a mutual fund exchange).
   * This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @return the related transaction id
   */
  getRelatedTransactionId(): string {
    return this.relatedTransactionId
  }

  /**
   * Sets any related transaction id for a mutual fund purchase (e.g. for a mutual fund exchange).
   * This is an optional field according to the OFX spec.
   * @see "Section 13.9.2.4.4, OFX Spec"
   *
   * @param relatedTransactionId the related transaction id
   */
  setRelatedTransactionId(relatedTransactionId: string): void {
    this.relatedTransactionId = relatedTransactionId
  }
}

Aggregate_add(BuyMutualFundTransaction, 'BUYMF')
Element_add(BuyMutualFundTransaction, {
  name: 'BUYTYPE',
  required: true,
  order: 20,
  type: String,
  read: BuyMutualFundTransaction.prototype.getBuyType,
  write: BuyMutualFundTransaction.prototype.setBuyType,
})
Element_add(BuyMutualFundTransaction, {
  name: 'RELFITID',
  order: 30,
  type: String,
  read: BuyMutualFundTransaction.prototype.getRelatedTransactionId,
  write: BuyMutualFundTransaction.prototype.setRelatedTransactionId,
})
