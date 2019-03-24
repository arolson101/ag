import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { Element_add } from '../../../meta/Element_add'

export class ProcDet {
  private dtAqd!: string
  private dtSale!: string
  private secName!: string
  private costBasis!: string
  private saleSpr!: string
  private longShort!: string
  private wasDisAllowed!: string
  private noncoveredSec!: string
  private basisNotshown!: string
  /**
   * @return the dtAqd
   */
  getDtAqd(): string {
    return this.dtAqd
  }
  /**
   * @param dtAqd the dtAqd to set
   */
  setDtAqd(dtAqd: string): void {
    this.dtAqd = dtAqd
  }
  /**
   * @return the dtSale
   */
  getDtSale(): string {
    return this.dtSale
  }
  /**
   * @param dtSale the dtSale to set
   */
  setDtSale(dtSale: string): void {
    this.dtSale = dtSale
  }
  /**
   * @return the secName
   */
  getSecName(): string {
    return this.secName
  }
  /**
   * @param secName the secName to set
   */
  setSecName(secName: string): void {
    this.secName = secName
  }
  /**
   * @return the costBasis
   */
  getCostBasis(): string {
    return this.costBasis
  }
  /**
   * @param costBasis the costBasis to set
   */
  setCostBasis(costBasis: string): void {
    this.costBasis = costBasis
  }
  /**
   * @return the saleSpr
   */
  getSaleSpr(): string {
    return this.saleSpr
  }
  /**
   * @param saleSpr the saleSpr to set
   */
  setSaleSpr(saleSpr: string): void {
    this.saleSpr = saleSpr
  }
  /**
   * @return the longShort
   */
  getLongShort(): string {
    return this.longShort
  }
  /**
   * @param longShort the longShort to set
   */
  setLongShort(longShort: string): void {
    this.longShort = longShort
  }
  /**
   * @return the wasDisAllowed
   */
  getWasDisAllowed(): string {
    return this.wasDisAllowed
  }
  /**
   * @param wasDisAllowed the wasDisAllowed to set
   */
  setWasDisAllowed(wasDisAllowed: string): void {
    this.wasDisAllowed = wasDisAllowed
  }
  /**
   * @return the noncoveredSec
   */
  getNoncoveredSec(): string {
    return this.noncoveredSec
  }
  /**
   * @param noncoveredSec the noncoveredSec to set
   */
  setNoncoveredSec(noncoveredSec: string): void {
    this.noncoveredSec = noncoveredSec
  }
  /**
   * @return the basisNotshown
   */
  getBasisNotshown(): string {
    return this.basisNotshown
  }
  /**
   * @param basisNotshown the basisNotshown to set
   */
  setBasisNotshown(basisNotshown: string): void {
    this.basisNotshown = basisNotshown
  }
}

Aggregate_add(ProcDet, 'PROCDET_V100')
Element_add(ProcDet, {
  name: 'DTAQD',
  required: false,
  order: 0,
  type: String,
  read: ProcDet.prototype.getDtAqd,
  write: ProcDet.prototype.setDtAqd,
})
Element_add(ProcDet, {
  name: 'DTSALE',
  required: false,
  order: 2,
  type: String,
  read: ProcDet.prototype.getDtSale,
  write: ProcDet.prototype.setDtSale,
})
Element_add(ProcDet, {
  name: 'SECNAME',
  required: false,
  order: 3,
  type: String,
  read: ProcDet.prototype.getSecName,
  write: ProcDet.prototype.setSecName,
})
Element_add(ProcDet, {
  name: 'COSTBASIS',
  required: false,
  order: 4,
  type: String,
  read: ProcDet.prototype.getCostBasis,
  write: ProcDet.prototype.setCostBasis,
})
Element_add(ProcDet, {
  name: 'SALESPR',
  required: false,
  order: 5,
  type: String,
  read: ProcDet.prototype.getSaleSpr,
  write: ProcDet.prototype.setSaleSpr,
})
Element_add(ProcDet, {
  name: 'LONGSHORT',
  required: false,
  order: 6,
  type: String,
  read: ProcDet.prototype.getLongShort,
  write: ProcDet.prototype.setLongShort,
})
Element_add(ProcDet, {
  name: 'WASHSALELOSSDISALLOWED',
  required: false,
  order: 7,
  type: String,
  read: ProcDet.prototype.getWasDisAllowed,
  write: ProcDet.prototype.setWasDisAllowed,
})
Element_add(ProcDet, {
  name: 'NONCOVEREDSECURITY',
  required: false,
  order: 8,
  type: String,
  read: ProcDet.prototype.getNoncoveredSec,
  write: ProcDet.prototype.setNoncoveredSec,
})
Element_add(ProcDet, {
  name: 'BASISNOTSHOWN',
  required: false,
  order: 9,
  type: String,
  read: ProcDet.prototype.getBasisNotshown,
  write: ProcDet.prototype.setBasisNotshown,
})
