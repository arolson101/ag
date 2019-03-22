export enum OFXParseEventType {
  CHARACTERS,
  ELEMENT,
}

/**
 * An event during OFX parsing.
 */
export class OFXParseEvent {
  private eventType: OFXParseEventType
  private eventValue: string

  constructor(eventType: OFXParseEventType, eventValue: string) {
    this.eventType = eventType
    this.eventValue = eventValue
  }

  getEventType(): OFXParseEventType {
    return this.eventType
  }

  getEventValue(): string {
    return this.eventValue
  }
}
