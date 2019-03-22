import { Aggregate_add } from '../../../../../meta/Aggregate_Add'
import { Element_add } from '../../../../../meta/Element_add'
import { ProcessorDayOff } from '../../../common/ProcessorDayOff'

/**
 * Stop Check Profile
 * @see "Section 11.13.2.3 OFX Spec"
 */
export class StopCheckProfile {
  private processorDaysOff: ProcessorDayOff[]
  private processEndTime: string
  private canUseRange: boolean
  private canUseDescription: boolean
  private stopCheckFee: number

  /**
   * Days of week that no processing occurs: MONDAY, TUESDAY, WEDNESDAY, THURSDAY,
   * FRIDAY, SATURDAY, or SUNDAY. 0 or more <PROCDAYSOFF> can be sent.
   * @return List of days during the week that no processing occurs.
   */
  getProcessorDaysOff(): ProcessorDayOff[] {
    return this.processorDaysOff
  }

  setProcessorDaysOff(processorDaysOff: ProcessorDayOff[]): void {
    this.processorDaysOff = processorDaysOff
  }

  /**
   * Gets time of day that day's processing ends.
   *
   * Time formatted as "HHMMSS.XXX[gmt offset[:tz name]]",
   * the milliseconds and time zone are still optional, and default to GMT.
   * @see "Section 3.2.8.3 OFX Spec"
   * @return Time String formatted as "HHMMSS.XXX[gmt offset[:tz name]]"
   */
  getProcessEndTime(): string {
    return this.processEndTime
  }

  /**
   * Sets the time of day that day's processing ends.
   *
   * Time formatted as "HHMMSS.XXX[gmt offset[:tz name]]",
   * the milliseconds and time zone are still optional, and default to GMT.

   * @see "Section 3.2.8.3 OFX Spec"
   * @param processEndTime formatted as "HHMMSS.XXX[gmt offset[:tz name]]"
   */
  setProcessEndTime(processEndTime: string): void {
    this.processEndTime = processEndTime
  }

  getCanUseRange(): boolean {
    return this.canUseRange
  }

  setCanUseRange(canUseRange: boolean): void {
    this.canUseRange = canUseRange
  }

  getCanUseDescription(): boolean {
    return this.canUseDescription
  }

  setCanUseDescription(canUseDescription: boolean): void {
    this.canUseDescription = canUseDescription
  }

  getStopCheckFee(): number {
    return this.stopCheckFee
  }

  setStopCheckFee(stopCheckFee: number): void {
    this.stopCheckFee = stopCheckFee
  }
}

Aggregate_add(StopCheckProfile, 'STPCHKPROF')
Element_add(StopCheckProfile, {
  name: 'PROCDAYSOFF',
  order: 0,
  type: Array,
  collectionEntryType: ProcessorDayOff,
  read: StopCheckProfile.prototype.getProcessorDaysOff,
  write: StopCheckProfile.prototype.setProcessorDaysOff,
})
Element_add(StopCheckProfile, {
  name: 'PROCENDTM',
  required: true,
  order: 10,
  type: String,
  read: StopCheckProfile.prototype.getProcessEndTime,
  write: StopCheckProfile.prototype.setProcessEndTime,
})
Element_add(StopCheckProfile, {
  name: 'CANUSERANGE',
  required: true,
  order: 20,
  type: Boolean,
  read: StopCheckProfile.prototype.getCanUseRange,
  write: StopCheckProfile.prototype.setCanUseRange,
})
Element_add(StopCheckProfile, {
  name: 'CANUSEDESC',
  required: true,
  order: 30,
  type: Boolean,
  read: StopCheckProfile.prototype.getCanUseDescription,
  write: StopCheckProfile.prototype.setCanUseDescription,
})
Element_add(StopCheckProfile, {
  name: 'STPCHKFEE',
  required: true,
  order: 40,
  type: Number,
  read: StopCheckProfile.prototype.getStopCheckFee,
  write: StopCheckProfile.prototype.setStopCheckFee,
})
