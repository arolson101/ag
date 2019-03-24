import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { PayerAddress } from './PayerAddress'
import { RecAddress } from './RecAddress'

export class Tax1099DIV {
  private srvrtId!: string
  private taxYear!: string
  private ordDiv!: string
  private qualifiedDiv!: string
  private totCapGain!: string
  private p28Gain!: string
  private unrecSec1250!: string
  private sec1202!: string
  private nonTaxDist!: string
  private fedTaxWh!: string
  private investExp!: string
  private forTaxPd!: string
  private cashLiq!: string
  private nonCashLiq!: string

  private payerAddress!: PayerAddress
  private payerId!: string
  private recAddress!: RecAddress
  private recId!: string
  private recAcct!: string

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
   * @return the ordDiv
   */
  getOrdDiv(): string {
    return this.ordDiv
  }

  /**
   * @param ordDiv the ordDiv to set
   */
  setOrdDiv(ordDiv: string): void {
    this.ordDiv = ordDiv
  }

  /**
   * @return the qualifiedDiv
   */
  getQualifiedDiv(): string {
    return this.qualifiedDiv
  }

  /**
   * @param qualifiedDiv the qualifiedDiv to set
   */
  setQualifiedDiv(qualifiedDiv: string): void {
    this.qualifiedDiv = qualifiedDiv
  }

  /**
   * @return the totCapGain
   */
  getTotCapGain(): string {
    return this.totCapGain
  }

  /**
   * @param totCapGain the totCapGain to set
   */
  setTotCapGain(totCapGain: string): void {
    this.totCapGain = totCapGain
  }

  /**
   * @return the p28Gain
   */
  getP28Gain(): string {
    return this.p28Gain
  }

  /**
   * @param p28Gain the p28Gain to set
   */
  setP28Gain(p28Gain: string): void {
    this.p28Gain = p28Gain
  }

  /**
   * @return the unrecSec1250
   */
  getUnrecSec1250(): string {
    return this.unrecSec1250
  }

  /**
   * @param unrecSec1250 the unrecSec1250 to set
   */
  setUnrecSec1250(unrecSec1250: string): void {
    this.unrecSec1250 = unrecSec1250
  }

  /**
   * @return the sec1202
   */
  getSec1202(): string {
    return this.sec1202
  }

  /**
   * @param sec1202 the sec1202 to set
   */
  setSec1202(sec1202: string): void {
    this.sec1202 = sec1202
  }

  /**
   * @return the nonTaxDist
   */
  getNonTaxDist(): string {
    return this.nonTaxDist
  }

  /**
   * @param nonTaxDist the nonTaxDist to set
   */
  setNonTaxDist(nonTaxDist: string): void {
    this.nonTaxDist = nonTaxDist
  }

  /**
   * @return the fedTaxWh
   */
  getFedTaxWh(): string {
    return this.fedTaxWh
  }

  /**
   * @param fedTaxWh the fedTaxWh to set
   */
  setFedTaxWh(fedTaxWh: string): void {
    this.fedTaxWh = fedTaxWh
  }

  /**
   * @return the investExp
   */
  getInvestExp(): string {
    return this.investExp
  }

  /**
   * @param investExp the investExp to set
   */
  setInvestExp(investExp: string): void {
    this.investExp = investExp
  }

  /**
   * @return the forTaxPd
   */
  getForTaxPd(): string {
    return this.forTaxPd
  }

  /**
   * @param forTaxPd the forTaxPd to set
   */
  setForTaxPd(forTaxPd: string): void {
    this.forTaxPd = forTaxPd
  }

  /**
   * @return the cashLiq
   */
  getCashLiq(): string {
    return this.cashLiq
  }

  /**
   * @param cashLiq the cashLiq to set
   */
  setCashLiq(cashLiq: string): void {
    this.cashLiq = cashLiq
  }

  /**
   * @return the nonCashLiq
   */
  getNonCashLiq(): string {
    return this.nonCashLiq
  }

  /**
   * @param nonCashLiq the nonCashLiq to set
   */
  setNonCashLiq(nonCashLiq: string): void {
    this.nonCashLiq = nonCashLiq
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

Aggregate_add(Tax1099DIV, 'TAX1099DIV_V100')
Element_add(Tax1099DIV, {
  name: 'SRVRTID',
  required: false,
  order: 0,
  type: String,
  read: Tax1099DIV.prototype.getSrvrtId,
  write: Tax1099DIV.prototype.setSrvrtId,
})
Element_add(Tax1099DIV, {
  name: 'TAXYEAR',
  required: false,
  order: 1,
  type: String,
  read: Tax1099DIV.prototype.getTaxYear,
  write: Tax1099DIV.prototype.setTaxYear,
})
Element_add(Tax1099DIV, {
  name: 'ORDDIV',
  required: false,
  order: 2,
  type: String,
  read: Tax1099DIV.prototype.getOrdDiv,
  write: Tax1099DIV.prototype.setOrdDiv,
})
Element_add(Tax1099DIV, {
  name: 'QUALIFIEDDIV',
  required: false,
  order: 3,
  type: String,
  read: Tax1099DIV.prototype.getQualifiedDiv,
  write: Tax1099DIV.prototype.setQualifiedDiv,
})
Element_add(Tax1099DIV, {
  name: 'TOTCAPGAIN',
  required: false,
  order: 4,
  type: String,
  read: Tax1099DIV.prototype.getTotCapGain,
  write: Tax1099DIV.prototype.setTotCapGain,
})
Element_add(Tax1099DIV, {
  name: 'P28GAIN',
  required: false,
  order: 5,
  type: String,
  read: Tax1099DIV.prototype.getP28Gain,
  write: Tax1099DIV.prototype.setP28Gain,
})
Element_add(Tax1099DIV, {
  name: 'UNRECSEC1250',
  required: false,
  order: 6,
  type: String,
  read: Tax1099DIV.prototype.getUnrecSec1250,
  write: Tax1099DIV.prototype.setUnrecSec1250,
})
Element_add(Tax1099DIV, {
  name: 'SEC1202',
  required: false,
  order: 7,
  type: String,
  read: Tax1099DIV.prototype.getSec1202,
  write: Tax1099DIV.prototype.setSec1202,
})
Element_add(Tax1099DIV, {
  name: 'NONTAXDIST',
  required: false,
  order: 8,
  type: String,
  read: Tax1099DIV.prototype.getNonTaxDist,
  write: Tax1099DIV.prototype.setNonTaxDist,
})
Element_add(Tax1099DIV, {
  name: 'FEDTAXWH',
  required: false,
  order: 9,
  type: String,
  read: Tax1099DIV.prototype.getFedTaxWh,
  write: Tax1099DIV.prototype.setFedTaxWh,
})
Element_add(Tax1099DIV, {
  name: 'INVESTEXP',
  required: false,
  order: 10,
  type: String,
  read: Tax1099DIV.prototype.getInvestExp,
  write: Tax1099DIV.prototype.setInvestExp,
})
Element_add(Tax1099DIV, {
  name: 'FORTAXPD',
  required: false,
  order: 11,
  type: String,
  read: Tax1099DIV.prototype.getForTaxPd,
  write: Tax1099DIV.prototype.setForTaxPd,
})
Element_add(Tax1099DIV, {
  name: 'CASHLIQ',
  required: false,
  order: 12,
  type: String,
  read: Tax1099DIV.prototype.getCashLiq,
  write: Tax1099DIV.prototype.setCashLiq,
})
Element_add(Tax1099DIV, {
  name: 'NONCASHLIQ',
  required: false,
  order: 13,
  type: String,
  read: Tax1099DIV.prototype.getNonCashLiq,
  write: Tax1099DIV.prototype.setNonCashLiq,
})
ChildAggregate_add(Tax1099DIV, {
  required: true,
  order: 14,
  type: PayerAddress,
  read: Tax1099DIV.prototype.getPayerAddress,
  write: Tax1099DIV.prototype.setPayerAddress,
})
Element_add(Tax1099DIV, {
  name: 'PAYERID',
  required: true,
  order: 15,
  type: String,
  read: Tax1099DIV.prototype.getPayerId,
  write: Tax1099DIV.prototype.setPayerId,
})
ChildAggregate_add(Tax1099DIV, {
  required: true,
  order: 16,
  type: RecAddress,
  read: Tax1099DIV.prototype.getRecAddress,
  write: Tax1099DIV.prototype.setRecAddress,
})
Element_add(Tax1099DIV, {
  name: 'RECID',
  required: true,
  order: 17,
  type: String,
  read: Tax1099DIV.prototype.getRecId,
  write: Tax1099DIV.prototype.setRecId,
})
Element_add(Tax1099DIV, {
  name: 'RECACCT',
  required: true,
  order: 18,
  type: String,
  read: Tax1099DIV.prototype.getRecAcct,
  write: Tax1099DIV.prototype.setRecAcct,
})
