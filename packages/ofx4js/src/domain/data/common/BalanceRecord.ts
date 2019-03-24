import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { ChildAggregate_add } from '../../../meta/ChildAggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { Currency } from './Currency'

export enum BalanceRecordType {
  DOLLAR,

  PERCENT,

  NUMBER,
}

/**
 * @see "Section 3.1.3, OFX Spec"
 */
export class BalanceRecord {
  private name!: string
  private description!: string
  private type!: BalanceRecordType
  private value!: string
  private timestamp!: Date
  private currency!: Currency

  /**
   * Name of the balance.
   *
   * @return Name of the balance.
   */
  getName(): string {
    return this.name
  }

  /**
   * Name of the balance.
   *
   * @param name Name of the balance.
   */
  setName(name: string): void {
    this.name = name
  }

  /**
   * Description of the balance.
   *
   * @return Description of the balance.
   */
  getDescription(): string {
    return this.description
  }

  /**
   * Description of the balance.
   *
   * @param description Description of the balance.
   */
  setDescription(description: string): void {
    this.description = description
  }

  /**
   * Type of the balance.
   *
   * @return Type of the balance.
   */
  getType(): BalanceRecordType {
    return this.type
  }

  /**
   * Type of the balance.
   *
   * @param type Type of the balance.
   */
  setType(type: BalanceRecordType): void {
    this.type = type
  }

  /**
   * The value of the balance.
   *
   * @return The value of the balance.
   */
  getValue(): string {
    return this.value
  }

  /**
   * The value of the balance.
   *
   * @param value The value of the balance.
   */
  setValue(value: string): void {
    this.value = value
  }

  /**
   * Timestamp of the balance.
   *
   * @return Timestamp of the balance.
   */
  getTimestamp(): Date {
    return this.timestamp
  }

  /**
   * Timestamp of the balance.
   *
   * @param timestamp Timestamp of the balance.
   */
  setTimestamp(timestamp: Date): void {
    this.timestamp = timestamp
  }

  /**
   * Currency.
   *
   * @return Currency.
   */
  getCurrency(): Currency {
    return this.currency
  }

  /**
   * Currency.
   *
   * @param currency Currency.
   */
  setCurrency(currency: Currency): void {
    this.currency = currency
  }
}

Aggregate_add(BalanceRecord, 'BAL')
Element_add(BalanceRecord, {
  name: 'NAME',
  required: true,
  order: 0,
  type: String,
  read: BalanceRecord.prototype.getName,
  write: BalanceRecord.prototype.setName,
})
Element_add(BalanceRecord, {
  name: 'DESC',
  required: true,
  order: 10,
  type: String,
  read: BalanceRecord.prototype.getDescription,
  write: BalanceRecord.prototype.setDescription,
})
Element_add(BalanceRecord, {
  name: 'BALTYPE',
  required: true,
  order: 20,
  type: BalanceRecordType,
  read: BalanceRecord.prototype.getType,
  write: BalanceRecord.prototype.setType,
})
Element_add(BalanceRecord, {
  name: 'VALUE',
  required: true,
  order: 30,
  type: String,
  read: BalanceRecord.prototype.getValue,
  write: BalanceRecord.prototype.setValue,
})
Element_add(BalanceRecord, {
  name: 'DTASOF',
  order: 40,
  type: Date,
  read: BalanceRecord.prototype.getTimestamp,
  write: BalanceRecord.prototype.setTimestamp,
})
ChildAggregate_add(BalanceRecord, {
  order: 50,
  type: Currency,
  read: BalanceRecord.prototype.getCurrency,
  write: BalanceRecord.prototype.setCurrency,
})
