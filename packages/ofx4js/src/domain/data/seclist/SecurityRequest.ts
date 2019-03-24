import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { Element_add } from '../../../meta/Element_add'
import { SecurityId } from './SecurityId'

/**
 * Security request aggregate.
 * @see "Section 13.8.2.2, OFX Spec"
 */
export class SecurityRequest {
  private securityId?: SecurityId
  private tickerSymbol?: string
  private fiId?: string

  getSecurityId(): SecurityId {
    return this.securityId!
  }

  setSecurityId(securityId: SecurityId): void {
    this.securityId = securityId
    this.tickerSymbol = undefined
    this.fiId = undefined
  }

  getTickerSymbol(): string {
    return this.tickerSymbol!
  }

  setTickerSymbol(tickerSymbol: string): void {
    this.tickerSymbol = tickerSymbol
    this.securityId = undefined
    this.fiId = undefined
  }

  getFiId(): string {
    return this.fiId!
  }

  setFiId(fiId: string): void {
    this.fiId = fiId
    this.securityId = undefined
    this.tickerSymbol = undefined
  }
}

Aggregate_add(SecurityRequest, 'SECRQ')
Element_add(SecurityRequest, {
  name: 'SECID',
  order: 10,
  type: SecurityId,
  read: SecurityRequest.prototype.getSecurityId,
  write: SecurityRequest.prototype.setSecurityId,
})
Element_add(SecurityRequest, {
  name: 'TICKER',
  order: 20,
  type: String,
  read: SecurityRequest.prototype.getTickerSymbol,
  write: SecurityRequest.prototype.setTickerSymbol,
})
Element_add(SecurityRequest, {
  name: 'FIID',
  order: 30,
  type: String,
  read: SecurityRequest.prototype.getFiId,
  write: SecurityRequest.prototype.setFiId,
})
