import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { PayerAddress } from './PayerAddress'
import { RecAddress } from './RecAddress'

export class Tax1099R {
  private srvrtId: string
  private taxYear: string
  private grossDist: string

  private taxAmt: string
  private taxAmtNd: string
  private capGain: string
  private fedTaxWh: string
  private empContins: string
  private netUnapEmp: string
  private distCode: string
  private iraSepSimp: string
  private annCtrctDist: string
  private totEmpCount: string

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
   * @return the grossDist
   */
  getGrossDist(): string {
    return this.grossDist
  }

  /**
   * @param grossDist the grossDist to set
   */
  setGrossDist(grossDist: string): void {
    this.grossDist = grossDist
  }

  /**
   * @return the taxAmt
   */
  getTaxAmt(): string {
    return this.taxAmt
  }

  /**
   * @param taxAmt the taxAmt to set
   */
  setTaxAmt(taxAmt: string): void {
    this.taxAmt = taxAmt
  }

  /**
   * @return the taxAmtNd
   */
  getTaxAmtNd(): string {
    return this.taxAmtNd
  }

  /**
   * @param taxAmtNd the taxAmtNd to set
   */
  setTaxAmtNd(taxAmtNd: string): void {
    this.taxAmtNd = taxAmtNd
  }

  /**
   * @return the capGain
   */
  getCapGain(): string {
    return this.capGain
  }

  /**
   * @param capGain the capGain to set
   */
  setCapGain(capGain: string): void {
    this.capGain = capGain
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
   * @return the empContins
   */
  getEmpContins(): string {
    return this.empContins
  }

  /**
   * @param empContins the empContins to set
   */
  setEmpContins(empContins: string): void {
    this.empContins = empContins
  }

  /**
   * @return the netUnapEmp
   */
  getNetUnapEmp(): string {
    return this.netUnapEmp
  }

  /**
   * @param netUnapEmp the netUnapEmp to set
   */
  setNetUnapEmp(netUnapEmp: string): void {
    this.netUnapEmp = netUnapEmp
  }

  /**
   * @return the distCode
   */
  getDistCode(): string {
    return this.distCode
  }

  /**
   * @param distCode the distCode to set
   */
  setDistCode(distCode: string): void {
    this.distCode = distCode
  }

  /**
   * @return the iraSepSimp
   */
  getIraSepSimp(): string {
    return this.iraSepSimp
  }

  /**
   * @param iraSepSimp the iraSepSimp to set
   */
  setIraSepSimp(iraSepSimp: string): void {
    this.iraSepSimp = iraSepSimp
  }

  /**
   * @return the annCtrctDist
   */
  getAnnCtrctDist(): string {
    return this.annCtrctDist
  }

  /**
   * @param annCtrctDist the annCtrctDist to set
   */
  setAnnCtrctDist(annCtrctDist: string): void {
    this.annCtrctDist = annCtrctDist
  }

  /**
   * @return the totEmpCount
   */
  getTotEmpCount(): string {
    return this.totEmpCount
  }

  /**
   * @param totEmpCount the totEmpCount to set
   */
  setTotEmpCount(totEmpCount: string): void {
    this.totEmpCount = totEmpCount
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

Aggregate_add(Tax1099R, 'TAX1099R_V100')
Element_add(Tax1099R, {
  name: 'SRVRTID',
  required: true,
  order: 0,
  type: String,
  read: Tax1099R.prototype.getSrvrtId,
  write: Tax1099R.prototype.setSrvrtId,
})
Element_add(Tax1099R, {
  name: 'TAXYEAR',
  required: true,
  order: 1,
  type: String,
  read: Tax1099R.prototype.getTaxYear,
  write: Tax1099R.prototype.setTaxYear,
})
Element_add(Tax1099R, {
  name: 'GROSSDIST',
  required: true,
  order: 2,
  type: String,
  read: Tax1099R.prototype.getGrossDist,
  write: Tax1099R.prototype.setGrossDist,
})
Element_add(Tax1099R, {
  name: 'TAXAMT',
  required: false,
  order: 3,
  type: String,
  read: Tax1099R.prototype.getTaxAmt,
  write: Tax1099R.prototype.setTaxAmt,
})
Element_add(Tax1099R, {
  name: 'TAXAMTND',
  required: false,
  order: 4,
  type: String,
  read: Tax1099R.prototype.getTaxAmtNd,
  write: Tax1099R.prototype.setTaxAmtNd,
})
Element_add(Tax1099R, {
  name: 'CAPGAIN',
  required: false,
  order: 5,
  type: String,
  read: Tax1099R.prototype.getCapGain,
  write: Tax1099R.prototype.setCapGain,
})
Element_add(Tax1099R, {
  name: 'FEDTAXWH',
  required: false,
  order: 6,
  type: String,
  read: Tax1099R.prototype.getFedTaxWh,
  write: Tax1099R.prototype.setFedTaxWh,
})
Element_add(Tax1099R, {
  name: 'EMPCONTINS',
  required: false,
  order: 7,
  type: String,
  read: Tax1099R.prototype.getEmpContins,
  write: Tax1099R.prototype.setEmpContins,
})
Element_add(Tax1099R, {
  name: 'NETUNAPEMP',
  required: false,
  order: 8,
  type: String,
  read: Tax1099R.prototype.getNetUnapEmp,
  write: Tax1099R.prototype.setNetUnapEmp,
})
Element_add(Tax1099R, {
  name: 'DISTCODE',
  required: true,
  order: 9,
  type: String,
  read: Tax1099R.prototype.getDistCode,
  write: Tax1099R.prototype.setDistCode,
})
Element_add(Tax1099R, {
  name: 'IRASEPSIMP',
  required: true,
  order: 10,
  type: String,
  read: Tax1099R.prototype.getIraSepSimp,
  write: Tax1099R.prototype.setIraSepSimp,
})
Element_add(Tax1099R, {
  name: 'ANNCTRCTDIST',
  required: false,
  order: 11,
  type: String,
  read: Tax1099R.prototype.getAnnCtrctDist,
  write: Tax1099R.prototype.setAnnCtrctDist,
})
Element_add(Tax1099R, {
  name: 'TOTEMPCONT',
  required: false,
  order: 12,
  type: String,
  read: Tax1099R.prototype.getTotEmpCount,
  write: Tax1099R.prototype.setTotEmpCount,
})
ChildAggregate_add(Tax1099R, {
  required: true,
  order: 13,
  type: PayerAddress,
  read: Tax1099R.prototype.getPayerAddress,
  write: Tax1099R.prototype.setPayerAddress,
})
Element_add(Tax1099R, {
  name: 'PAYERID',
  required: true,
  order: 14,
  type: String,
  read: Tax1099R.prototype.getPayerId,
  write: Tax1099R.prototype.setPayerId,
})
ChildAggregate_add(Tax1099R, {
  required: true,
  order: 15,
  type: RecAddress,
  read: Tax1099R.prototype.getRecAddress,
  write: Tax1099R.prototype.setRecAddress,
})
Element_add(Tax1099R, {
  name: 'RECID',
  required: true,
  order: 16,
  type: String,
  read: Tax1099R.prototype.getRecId,
  write: Tax1099R.prototype.setRecId,
})
Element_add(Tax1099R, {
  name: 'RECACCT',
  required: true,
  order: 17,
  type: String,
  read: Tax1099R.prototype.getRecAcct,
  write: Tax1099R.prototype.setRecAcct,
})
