import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { Element_add } from '../../../meta/Element_add'
import { TransferStatusEvent } from './TransferStatusEvent'

export class TransferStatus {
  private event!: TransferStatusEvent
  private date!: Date

  /**
   * The event.
   *
   * @return The event.
   */
  getEvent(): TransferStatusEvent {
    return this.event
  }

  /**
   * The event.
   *
   * @param event The event.
   */
  setEvent(event: TransferStatusEvent): void {
    this.event = event
  }

  /**
   * The date of the event.
   *
   * @return The date of the event.
   */
  getDate(): Date {
    return this.date
  }

  /**
   * The date of the event.
   *
   * @param date The date of the event.
   */
  setDate(date: Date): void {
    this.date = date
  }
}

Aggregate_add(TransferStatus, 'XFERPRCSTS')
Element_add(TransferStatus, {
  name: 'XFERPRCCODE',
  required: true,
  order: 0,
  type: TransferStatusEvent,
  read: TransferStatus.prototype.getEvent,
  write: TransferStatus.prototype.setEvent,
})
Element_add(TransferStatus, {
  name: 'DTXFERPRC',
  required: true,
  order: 10,
  type: Date,
  read: TransferStatus.prototype.getDate,
  write: TransferStatus.prototype.setDate,
})
