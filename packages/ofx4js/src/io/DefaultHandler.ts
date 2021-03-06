import { OFXHandler } from './OFXHandler'

/**
 * Default (no-op) implementation of an OFX handler.
 */
export class DefaultHandler implements OFXHandler {
  onHeader(name: string, value: string): void {}

  onElement(name: string, value: string): void {}

  startAggregate(aggregateName: string): void {}

  endAggregate(aggregateName: string): void {}
}
