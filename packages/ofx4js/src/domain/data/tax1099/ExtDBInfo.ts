import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_Add'
import { Element_add } from '../../../meta/Element_add'
import { ProcDet } from './ProcDet'

export class ExtDBInfo {
  private procDet!: ProcDet[]
  private teInterest!: string
  private pabInterest!: string
  private teIntDividend!: string
  private pabDividend!: string

  /**
   * @return the procDet
   */
  getProcDet(): ProcDet[] {
    return this.procDet
  }

  /**
   * @param procDet the procDet to set
   */
  setProcDet(procDet: ProcDet[]): void {
    this.procDet = procDet
  }

  /**
   * @return the teInterest
   */
  getTeInterest(): string {
    return this.teInterest
  }

  /**
   * @param teInterest the teInterest to set
   */
  setTeInterest(teInterest: string): void {
    this.teInterest = teInterest
  }

  /**
   * @return the pabInterest
   */
  getPabInterest(): string {
    return this.pabInterest
  }

  /**
   * @param pabInterest the pabInterest to set
   */
  setPabInterest(pabInterest: string): void {
    this.pabInterest = pabInterest
  }

  /**
   * @return the teIntDividend
   */
  getTeIntDividend(): string {
    return this.teIntDividend
  }

  /**
   * @param teIntDividend the teIntDividend to set
   */
  setTeIntDividend(teIntDividend: string): void {
    this.teIntDividend = teIntDividend
  }

  /**
   * @return the pabDividend
   */
  getPabDividend(): string {
    return this.pabDividend
  }

  /**
   * @param pabDividend the pabDividend to set
   */
  setPabDividend(pabDividend: string): void {
    this.pabDividend = pabDividend
  }
}

Aggregate_add(ExtDBInfo, 'EXTDBINFO_V100')
ChildAggregate_add(ExtDBInfo, {
  required: false,
  order: 0,
  type: Array,
  collectionEntryType: ProcDet,
  read: ExtDBInfo.prototype.getProcDet,
  write: ExtDBInfo.prototype.setProcDet,
})
Element_add(ExtDBInfo, {
  name: 'TEINTEREST',
  required: false,
  order: 1,
  type: String,
  read: ExtDBInfo.prototype.getTeInterest,
  write: ExtDBInfo.prototype.setTeInterest,
})
Element_add(ExtDBInfo, {
  name: 'PABINTEREST',
  required: false,
  order: 2,
  type: String,
  read: ExtDBInfo.prototype.getPabInterest,
  write: ExtDBInfo.prototype.setPabInterest,
})
Element_add(ExtDBInfo, {
  name: 'TEINTDIVIDEND',
  required: false,
  order: 3,
  type: String,
  read: ExtDBInfo.prototype.getTeIntDividend,
  write: ExtDBInfo.prototype.setTeIntDividend,
})
Element_add(ExtDBInfo, {
  name: 'PABDIVIDEND',
  required: false,
  order: 4,
  type: String,
  read: ExtDBInfo.prototype.getPabDividend,
  write: ExtDBInfo.prototype.setPabDividend,
})
