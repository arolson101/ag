import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { T1099Response } from '../common/T1099Response'
import { Tax1099B } from './Tax1099B'
import { Tax1099DIV } from './Tax1099DIV'
import { Tax1099INT } from './Tax1099INT'
import { Tax1099MISC } from './Tax1099MISC'
import { Tax1099OID } from './Tax1099OID'
import { Tax1099R } from './Tax1099R'

export class Tax1099Response extends T1099Response {
  // private tax1099div: Tax1099DIV;
  private lstTax1099DIV!: Tax1099DIV[]

  private lstTax1099INT!: Tax1099INT[]

  private lstTax1099R!: Tax1099R[]

  private lstTax1099B!: Tax1099B[]

  private lstTax1099MISC!: Tax1099MISC[]

  private lstTax1099OID!: Tax1099OID[]

  /**
   * @return the lstTax1099DIV
   */
  getLstTax1099DIV(): Tax1099DIV[] {
    return this.lstTax1099DIV
  }

  /**
   * @param lstTax1099DIV
   *            the lstTax1099DIV to set
   */
  setLstTax1099DIV(lstTax1099DIV: Tax1099DIV[]): void {
    this.lstTax1099DIV = lstTax1099DIV
  }

  getResponseMessageName(): string {
    return '1099 Tax details'
  }

  /**
   * @return the lstTax1099INT
   */
  getLstTax1099INT(): Tax1099INT[] {
    return this.lstTax1099INT
  }

  /**
   * @param lstTax1099INT the lstTax1099INT to set
   */
  setLstTax1099INT(lstTax1099INT: Tax1099INT[]): void {
    this.lstTax1099INT = lstTax1099INT
  }

  /**
   * @return the lstTax1099R
   */
  getLstTax1099R(): Tax1099R[] {
    return this.lstTax1099R
  }

  /**
   * @param lstTax1099R the lstTax1099R to set
   */
  setLstTax1099R(lstTax1099R: Tax1099R[]): void {
    this.lstTax1099R = lstTax1099R
  }

  /**
   * @return the lstTax1099B
   */
  getLstTax1099B(): Tax1099B[] {
    return this.lstTax1099B
  }

  /**
   * @param lstTax1099B the lstTax1099B to set
   */
  setLstTax1099B(lstTax1099B: Tax1099B[]): void {
    this.lstTax1099B = lstTax1099B
  }

  /**
   * @return the lstTax1099MISC
   */
  getLstTax1099MISC(): Tax1099MISC[] {
    return this.lstTax1099MISC
  }

  /**
   * @param lstTax1099MISC the lstTax1099MISC to set
   */
  setLstTax1099MISC(lstTax1099MISC: Tax1099MISC[]): void {
    this.lstTax1099MISC = lstTax1099MISC
  }

  /**
   * @return the lstTax1099OID
   */
  getLstTax1099OID(): Tax1099OID[] {
    return this.lstTax1099OID
  }

  /**
   * @param lstTax1099OID the lstTax1099OID to set
   */
  setLstTax1099OID(lstTax1099OID: Tax1099OID[]): void {
    this.lstTax1099OID = lstTax1099OID
  }
}

Aggregate_add(Tax1099Response, 'TAX1099RS')
ChildAggregate_add(Tax1099Response, {
  required: false,
  order: 0,
  type: Array,
  collectionEntryType: Tax1099DIV,
  read: Tax1099Response.prototype.getLstTax1099DIV,
  write: Tax1099Response.prototype.setLstTax1099DIV,
})
ChildAggregate_add(Tax1099Response, {
  required: false,
  order: 1,
  type: Array,
  collectionEntryType: Tax1099INT,
  read: Tax1099Response.prototype.getLstTax1099INT,
  write: Tax1099Response.prototype.setLstTax1099INT,
})
ChildAggregate_add(Tax1099Response, {
  required: false,
  order: 2,
  type: Array,
  collectionEntryType: Tax1099R,
  read: Tax1099Response.prototype.getLstTax1099R,
  write: Tax1099Response.prototype.setLstTax1099R,
})
ChildAggregate_add(Tax1099Response, {
  required: false,
  order: 3,
  type: Array,
  collectionEntryType: Tax1099B,
  read: Tax1099Response.prototype.getLstTax1099B,
  write: Tax1099Response.prototype.setLstTax1099B,
})
ChildAggregate_add(Tax1099Response, {
  required: false,
  order: 4,
  type: Array,
  collectionEntryType: Tax1099MISC,
  read: Tax1099Response.prototype.getLstTax1099MISC,
  write: Tax1099Response.prototype.setLstTax1099MISC,
})
ChildAggregate_add(Tax1099Response, {
  required: false,
  order: 5,
  type: Array,
  collectionEntryType: Tax1099OID,
  read: Tax1099Response.prototype.getLstTax1099OID,
  write: Tax1099Response.prototype.setLstTax1099OID,
})
