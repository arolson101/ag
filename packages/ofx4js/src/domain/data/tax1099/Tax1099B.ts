import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { ExtDBInfo } from './ExtDBInfo'
import { PayerAddress } from './PayerAddress'
import { RecAddress } from './RecAddress'

export class Tax1099B {
  private srvrtId: string
  private taxYear: string
  private extDBInfo: ExtDBInfo
  private payerAddress: PayerAddress
  private payerId: string
  private recAddress: RecAddress
  private recId: string
  private recAcct: string

  getSrvrtId(): string {
    return this.srvrtId
  }

  setSrvrtId(srvrtId: string): void {
    this.srvrtId = srvrtId
  }

  getTaxYear(): string {
    return this.taxYear
  }

  setTaxYear(taxYear: string): void {
    this.taxYear = taxYear
  }

  /**
   * @return the extDBInfo
   */
  getExtDBInfo(): ExtDBInfo {
    return this.extDBInfo
  }

  /**
   * @param extDBInfo the extDBInfo to set
   */
  setExtDBInfo(extDBInfo: ExtDBInfo): void {
    this.extDBInfo = extDBInfo
  }

  /**
   * @return the payerAddress
   */
  getPayerAddress(): PayerAddress {
    return this.payerAddress
  }

  /**
   * @param payerAddress the payerAddress to set
   */
  setPayerAddress(payerAddress: PayerAddress): void {
    this.payerAddress = payerAddress
  }

  /**
   * @return the payerId
   */
  getPayerId(): string {
    return this.payerId
  }

  /**
   * @param payerId the payerId to set
   */
  setPayerId(payerId: string): void {
    this.payerId = payerId
  }

  /**
   * @return the recAddress
   */
  getRecAddress(): RecAddress {
    return this.recAddress
  }

  /**
   * @param recAddress the recAddress to set
   */
  setRecAddress(recAddress: RecAddress): void {
    this.recAddress = recAddress
  }

  /**
   * @return the recId
   */
  getRecId(): string {
    return this.recId
  }

  /**
   * @param recId the recId to set
   */
  setRecId(recId: string): void {
    this.recId = recId
  }

  /**
   * @return the recAcct
   */
  getRecAcct(): string {
    return this.recAcct
  }

  /**
   * @param recAcct the recAcct to set
   */
  setRecAcct(recAcct: string): void {
    this.recAcct = recAcct
  }
}

Aggregate_add(Tax1099B, 'TAX1099B_V100')
Element_add(Tax1099B, {
  name: 'SRVRTID',
  required: true,
  order: 0,
  type: String,
  read: Tax1099B.prototype.getSrvrtId,
  write: Tax1099B.prototype.setSrvrtId,
})
Element_add(Tax1099B, {
  name: 'TAXYEAR',
  required: true,
  order: 1,
  type: String,
  read: Tax1099B.prototype.getTaxYear,
  write: Tax1099B.prototype.setTaxYear,
})
ChildAggregate_add(Tax1099B, {
  required: true,
  order: 2,
  type: ExtDBInfo,
  read: Tax1099B.prototype.getExtDBInfo,
  write: Tax1099B.prototype.setExtDBInfo,
})
ChildAggregate_add(Tax1099B, {
  required: true,
  order: 3,
  type: PayerAddress,
  read: Tax1099B.prototype.getPayerAddress,
  write: Tax1099B.prototype.setPayerAddress,
})
Element_add(Tax1099B, {
  name: 'PAYERID',
  required: true,
  order: 4,
  type: String,
  read: Tax1099B.prototype.getPayerId,
  write: Tax1099B.prototype.setPayerId,
})
ChildAggregate_add(Tax1099B, {
  required: true,
  order: 5,
  type: RecAddress,
  read: Tax1099B.prototype.getRecAddress,
  write: Tax1099B.prototype.setRecAddress,
})
Element_add(Tax1099B, {
  name: 'RECID',
  required: true,
  order: 6,
  type: String,
  read: Tax1099B.prototype.getRecId,
  write: Tax1099B.prototype.setRecId,
})
Element_add(Tax1099B, {
  name: 'RECACCT',
  required: true,
  order: 7,
  type: String,
  read: Tax1099B.prototype.getRecAcct,
  write: Tax1099B.prototype.setRecAcct,
})
