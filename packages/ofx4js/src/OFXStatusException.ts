import { Status } from './domain/data/common/Status'
import { OFXException } from './OFXException'

/**
 * Exception based on a StatusCode response
 */
export class OFXStatusException extends OFXException {
  private status: Status

  constructor(status: Status, message: string) {
    super(message)
    this.status = status
  }

  getStatus(): Status {
    return this.status
  }
}
