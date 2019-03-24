import { OFXException } from '../OFXException'

export class NoOFXResponseException extends OFXException {
  constructor(message?: string) {
    super(message)
  }
}
