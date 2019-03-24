import { OFXException } from './OFXException'

export class OFXRuntimeException extends OFXException {
  constructor(message?: string) {
    super(message)
  }
}
