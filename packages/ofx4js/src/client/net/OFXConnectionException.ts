import { Error, OFXException } from '../../OFXException'

/**
 * Error with a particular OFX connection.
 */
export class OFXConnectionException extends OFXException {
  constructor(message: string, e?: Error) {
    super(message, e)
  }
}
