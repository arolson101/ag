import { OFXException } from './OFXException'

export class OFXTransactionException extends OFXException {
  constructor(message?: string) {
    super(message)
  }
}
