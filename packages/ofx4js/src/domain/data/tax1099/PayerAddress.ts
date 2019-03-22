import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { Element_add } from '../../../meta/Element_add'

export class PayerAddress {
  private payerName1: string
  private payerName2: string
  private address1: string
  private address2: string
  private city: string
  private state: string
  private postalCode: string
  private phone: string
  /**
   * @return the payerName1
   */
  getPayerName1(): string {
    return this.payerName1
  }
  /**
   * @param payerName1 the payerName1 to set
   */
  setPayerName1(payerName1: string): void {
    this.payerName1 = payerName1
  }
  /**
   * @return the payerName2
   */
  getPayerName2(): string {
    return this.payerName2
  }
  /**
   * @param payerName2 the payerName2 to set
   */
  setPayerName2(payerName2: string): void {
    this.payerName2 = payerName2
  }
  /**
   * @return the address1
   */
  getAddress1(): string {
    return this.address1
  }
  /**
   * @param address1 the address1 to set
   */
  setAddress1(address1: string): void {
    this.address1 = address1
  }

  /**
   * @return the address2
   */
  getAddress2(): string {
    return this.address2
  }
  /**
   * @param address2 the address2 to set
   */
  setAddress2(address2: string): void {
    this.address2 = address2
  }
  /**
   * @return the city
   */
  getCity(): string {
    return this.city
  }
  /**
   * @param city the city to set
   */
  setCity(city: string): void {
    this.city = city
  }
  /**
   * @return the state
   */
  getState(): string {
    return this.state
  }
  /**
   * @param state the state to set
   */
  setState(state: string): void {
    this.state = state
  }
  /**
   * @return the postalCode
   */
  getPostalCode(): string {
    return this.postalCode
  }
  /**
   * @param postalCode the postalCode to set
   */
  setPostalCode(postalCode: string): void {
    this.postalCode = postalCode
  }
  /**
   * @return the phone
   */
  getPhone(): string {
    return this.phone
  }
  /**
   * @param phone the phone to set
   */
  setPhone(phone: string): void {
    this.phone = phone
  }
}

Aggregate_add(PayerAddress, 'PAYERADDR')
Element_add(PayerAddress, {
  name: 'PAYERNAME1',
  required: true,
  order: 0,
  type: String,
  read: PayerAddress.prototype.getPayerName1,
  write: PayerAddress.prototype.setPayerName1,
})
Element_add(PayerAddress, {
  name: 'PAYERNAME2',
  required: false,
  order: 1,
  type: String,
  read: PayerAddress.prototype.getPayerName2,
  write: PayerAddress.prototype.setPayerName2,
})
Element_add(PayerAddress, {
  name: 'ADDR1',
  required: true,
  order: 2,
  type: String,
  read: PayerAddress.prototype.getAddress1,
  write: PayerAddress.prototype.setAddress1,
})
Element_add(PayerAddress, {
  name: 'ADDR2',
  required: true,
  order: 3,
  type: String,
  read: PayerAddress.prototype.getAddress2,
  write: PayerAddress.prototype.setAddress2,
})
Element_add(PayerAddress, {
  name: 'CITY',
  required: true,
  order: 4,
  type: String,
  read: PayerAddress.prototype.getCity,
  write: PayerAddress.prototype.setCity,
})
Element_add(PayerAddress, {
  name: 'STATE',
  required: true,
  order: 5,
  type: String,
  read: PayerAddress.prototype.getState,
  write: PayerAddress.prototype.setState,
})
Element_add(PayerAddress, {
  name: 'POSTALCODE',
  required: true,
  order: 6,
  type: String,
  read: PayerAddress.prototype.getPostalCode,
  write: PayerAddress.prototype.setPostalCode,
})
Element_add(PayerAddress, {
  name: 'PHONE',
  required: false,
  order: 7,
  type: String,
  read: PayerAddress.prototype.getPhone,
  write: PayerAddress.prototype.setPhone,
})
