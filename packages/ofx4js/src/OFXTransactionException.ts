import { OFXException } from './OFXException'

export class OFXTransactionException extends OFXException {
  constructor(message: string = null) {
    super(message)
  }
}
