import { Aggregate_add } from '../../../../meta/Aggregate_Add'
import { Element_add } from '../../../../meta/Element_add'
import { ProcessorDayOff } from '../../common/ProcessorDayOff'
import { MessageSetType } from '../../MessageSetType'
import { VersionSpecificMessageSetInfo } from '../VersionSpecificMessageSetInfo'

/**
 * BillPay Message Set Profile
 * @see "Section 12.11.2 OFX Spec"
 */
export class BillpayV1MessageSetInfo extends VersionSpecificMessageSetInfo {
  private daysWith!: number
  private defaultDaysToPay!: number
  private transferDaysWith!: number
  private transferDefaultDaysToPay!: number
  private processorDaysOff!: ProcessorDayOff[]
  private processorEndTime!: string
  private modelWindow!: number
  private postProcessorWindow!: number
  private supportsStatusUpdateViaPaymentModificationResponse!: boolean
  private supportsPaymentByAddress!: boolean
  private supportsPaymentByTransfer!: boolean
  private supportsPaymentByPayeeId!: boolean
  private userCanAddPayee!: boolean
  private supportsExtendedPayment!: boolean
  private canModifyPayments!: boolean
  private canModifyModels!: boolean
  private supportsDifferentFirstPayment!: boolean
  private supportsDifferentLastPayment!: boolean
  private supportsBillPresentmentContext!: boolean

  getMessageSetType(): MessageSetType {
    return MessageSetType.payments
  }

  getDaysWith(): number {
    return this.daysWith
  }

  setDaysWith(daysWith: number): void {
    this.daysWith = daysWith
  }

  getDefaultDaysToPay(): number {
    return this.defaultDaysToPay
  }

  setDefaultDaysToPay(defaultDaysToPay: number): void {
    this.defaultDaysToPay = defaultDaysToPay
  }

  getTransferDaysWith(): number {
    return this.transferDaysWith
  }

  setTransferDaysWith(transferDaysWith: number): void {
    this.transferDaysWith = transferDaysWith
  }

  getTransferDefaultDaysToPay(): number {
    return this.transferDefaultDaysToPay
  }

  setTransferDefaultDaysToPay(transferDefaultDaysToPay: number): void {
    this.transferDefaultDaysToPay = transferDefaultDaysToPay
  }

  getProcessorDaysOff(): ProcessorDayOff[] {
    return this.processorDaysOff
  }

  setProcessorDaysOff(processorDaysOff: ProcessorDayOff[]): void {
    this.processorDaysOff = processorDaysOff
  }

  getProcessorEndTime(): string {
    return this.processorEndTime
  }

  setProcessorEndTime(processorEndTime: string): void {
    this.processorEndTime = processorEndTime
  }

  getModelWindow(): number {
    return this.modelWindow
  }

  setModelWindow(modelWindow: number): void {
    this.modelWindow = modelWindow
  }

  getPostProcessorWindow(): number {
    return this.postProcessorWindow
  }

  setPostProcessorWindow(postProcessorWindow: number): void {
    this.postProcessorWindow = postProcessorWindow
  }

  getSupportsStatusUpdateViaPaymentModificationResponse(): boolean {
    return this.supportsStatusUpdateViaPaymentModificationResponse
  }

  setSupportsStatusUpdateViaPaymentModificationResponse(
    supportsStatusUpdateViaPaymentModificationResponse: boolean
  ): void {
    // tslint:disable-next-line:max-line-length
    this.supportsStatusUpdateViaPaymentModificationResponse = supportsStatusUpdateViaPaymentModificationResponse
  }

  getSupportsPaymentByAddress(): boolean {
    return this.supportsPaymentByAddress
  }

  setSupportsPaymentByAddress(supportsPaymentByAddress: boolean): void {
    this.supportsPaymentByAddress = supportsPaymentByAddress
  }

  getSupportsPaymentByTransfer(): boolean {
    return this.supportsPaymentByTransfer
  }

  setSupportsPaymentByTransfer(supportsPaymentByTransfer: boolean): void {
    this.supportsPaymentByTransfer = supportsPaymentByTransfer
  }

  getSupportsPaymentByPayeeId(): boolean {
    return this.supportsPaymentByPayeeId
  }

  setSupportsPaymentByPayeeId(supportsPaymentByPayeeId: boolean): void {
    this.supportsPaymentByPayeeId = supportsPaymentByPayeeId
  }

  getUserCanAddPayee(): boolean {
    return this.userCanAddPayee
  }

  setUserCanAddPayee(userCanAddPayee: boolean): void {
    this.userCanAddPayee = userCanAddPayee
  }

  getSupportsExtendedPayment(): boolean {
    return this.supportsExtendedPayment
  }

  setSupportsExtendedPayment(supportsExtendedPayment: boolean): void {
    this.supportsExtendedPayment = supportsExtendedPayment
  }

  getCanModifyPayments(): boolean {
    return this.canModifyPayments
  }

  setCanModifyPayments(canModifyPayments: boolean): void {
    this.canModifyPayments = canModifyPayments
  }

  getCanModifyModels(): boolean {
    return this.canModifyModels
  }

  setCanModifyModels(canModifyModels: boolean): void {
    this.canModifyModels = canModifyModels
  }

  getSupportsDifferentFirstPayment(): boolean {
    return this.supportsDifferentFirstPayment
  }

  setSupportsDifferentFirstPayment(supportsDifferentFirstPayment: boolean): void {
    this.supportsDifferentFirstPayment = supportsDifferentFirstPayment
  }

  getSupportsDifferentLastPayment(): boolean {
    return this.supportsDifferentLastPayment
  }

  setSupportsDifferentLastPayment(supportsDifferentLastPayment: boolean): void {
    this.supportsDifferentLastPayment = supportsDifferentLastPayment
  }

  getSupportsBillPresentmentContext(): boolean {
    return this.supportsBillPresentmentContext
  }

  setSupportsBillPresentmentContext(supportsBillPresentmentContext: boolean): void {
    this.supportsBillPresentmentContext = supportsBillPresentmentContext
  }
}

Aggregate_add(BillpayV1MessageSetInfo, 'BILLPAYMSGSETV1')
Element_add(BillpayV1MessageSetInfo, {
  name: 'DAYSWITH',
  required: true,
  order: 10,
  type: Number,
  read: BillpayV1MessageSetInfo.prototype.getDaysWith,
  write: BillpayV1MessageSetInfo.prototype.setDaysWith,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'DFLTDAYSTOPAY',
  required: true,
  order: 20,
  type: Number,
  read: BillpayV1MessageSetInfo.prototype.getDefaultDaysToPay,
  write: BillpayV1MessageSetInfo.prototype.setDefaultDaysToPay,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'XFERDAYSWITH',
  required: true,
  order: 30,
  type: Number,
  read: BillpayV1MessageSetInfo.prototype.getTransferDaysWith,
  write: BillpayV1MessageSetInfo.prototype.setTransferDaysWith,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'XFERDFLTDAYSTOPAY',
  required: true,
  order: 40,
  type: Number,
  read: BillpayV1MessageSetInfo.prototype.getTransferDefaultDaysToPay,
  write: BillpayV1MessageSetInfo.prototype.setTransferDefaultDaysToPay,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'PROCDAYSOFF',
  order: 50,
  type: Array,
  /*collectionEntryType: ProcessorDayOff,*/ read:
    BillpayV1MessageSetInfo.prototype.getProcessorDaysOff,
  write: BillpayV1MessageSetInfo.prototype.setProcessorDaysOff,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'PROCENDTM',
  required: true,
  order: 60,
  type: String,
  read: BillpayV1MessageSetInfo.prototype.getProcessorEndTime,
  write: BillpayV1MessageSetInfo.prototype.setProcessorEndTime,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'MODELWND',
  required: true,
  order: 70,
  type: Number,
  read: BillpayV1MessageSetInfo.prototype.getModelWindow,
  write: BillpayV1MessageSetInfo.prototype.setModelWindow,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'POSTPROCWND',
  required: true,
  order: 80,
  type: Number,
  read: BillpayV1MessageSetInfo.prototype.getPostProcessorWindow,
  write: BillpayV1MessageSetInfo.prototype.setPostProcessorWindow,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'STSVIAMODS',
  required: true,
  order: 90,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsStatusUpdateViaPaymentModificationResponse,
  write: BillpayV1MessageSetInfo.prototype.setSupportsStatusUpdateViaPaymentModificationResponse,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'PMTBYADDR',
  required: true,
  order: 100,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsPaymentByAddress,
  write: BillpayV1MessageSetInfo.prototype.setSupportsPaymentByAddress,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'PMTBYXFER',
  required: true,
  order: 110,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsPaymentByTransfer,
  write: BillpayV1MessageSetInfo.prototype.setSupportsPaymentByTransfer,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'PMTBYPAYEEID',
  required: true,
  order: 120,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsPaymentByPayeeId,
  write: BillpayV1MessageSetInfo.prototype.setSupportsPaymentByPayeeId,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'CANADDPAYEE',
  required: true,
  order: 130,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getUserCanAddPayee,
  write: BillpayV1MessageSetInfo.prototype.setUserCanAddPayee,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'HASEXTDPMT',
  required: true,
  order: 140,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsExtendedPayment,
  write: BillpayV1MessageSetInfo.prototype.setSupportsExtendedPayment,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'CANMODPMTS',
  required: true,
  order: 150,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getCanModifyPayments,
  write: BillpayV1MessageSetInfo.prototype.setCanModifyPayments,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'CANMODMDLS',
  required: true,
  order: 160,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getCanModifyModels,
  write: BillpayV1MessageSetInfo.prototype.setCanModifyModels,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'DIFFFIRSTPMT',
  required: true,
  order: 170,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsDifferentFirstPayment,
  write: BillpayV1MessageSetInfo.prototype.setSupportsDifferentFirstPayment,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'DIFFLASTPMT',
  required: true,
  order: 180,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsDifferentLastPayment,
  write: BillpayV1MessageSetInfo.prototype.setSupportsDifferentLastPayment,
})
Element_add(BillpayV1MessageSetInfo, {
  name: 'BILLPUBCONTEXT',
  order: 190,
  type: Boolean,
  read: BillpayV1MessageSetInfo.prototype.getSupportsBillPresentmentContext,
  write: BillpayV1MessageSetInfo.prototype.setSupportsBillPresentmentContext,
})
