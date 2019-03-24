import { Aggregate_add } from '../../../meta/Aggregate_add'
import { Element_add } from '../../../meta/Element_add'
import { Severity, StatusCode } from './StatusCode'

/**
 * Known status codes.
 */
export class KnownCode extends StatusCode {
  static SUCCESS: KnownCode = new KnownCode(0, 'Success', Severity.INFO)
  static CLIENT_UP_TO_DATE: KnownCode = new KnownCode(1, 'Client is up-to-date', Severity.INFO)
  static GENERAL_ERROR: KnownCode = new KnownCode(2000, 'General error.', Severity.ERROR)
  static GENERAL_ACCOUNT_ERROR: KnownCode = new KnownCode(
    2002,
    'General account error.',
    Severity.ERROR
  )
  static ACCOUNT_NOT_FOUND: KnownCode = new KnownCode(2003, 'Account not found.', Severity.ERROR)
  static ACCOUNT_CLOSED: KnownCode = new KnownCode(2004, 'Account closed.', Severity.ERROR)
  static ACCOUNT_NOT_AUTHORIZED: KnownCode = new KnownCode(
    2005,
    'Account not authorized.',
    Severity.ERROR
  )
  static DATE_TOO_SOON: KnownCode = new KnownCode(2014, 'Date too soon', Severity.ERROR)
  static DUPLICATE_REQUEST: KnownCode = new KnownCode(2019, 'Duplicate request.', Severity.ERROR)
  static UNSUPPORTED_VERSION: KnownCode = new KnownCode(2021, 'Unsupported version', Severity.ERROR)
  static INVALID_TAN: KnownCode = new KnownCode(
    2022,
    'Invalid transaction authorization number.',
    Severity.ERROR
  )
  static MFA_CHALLENGE_REQUIRED: KnownCode = new KnownCode(
    3000,
    'Further authentication required.',
    Severity.ERROR
  )
  static MFA_CHALLENGE_FAILED: KnownCode = new KnownCode(3001, 'MFA failed.', Severity.ERROR)
  static PASSWORD_CHANGE_REQUIRED: KnownCode = new KnownCode(
    15000,
    'Password change required.',
    Severity.INFO
  )
  static SIGNON_INVALID: KnownCode = new KnownCode(15500, 'Invalid signon', Severity.ERROR)
  static CUSTOMER_ACCOUNT_IN_USE: KnownCode = new KnownCode(
    15501,
    'Customer account in use.',
    Severity.ERROR
  )
  static PASSWORD_LOCKED: KnownCode = new KnownCode(15502, 'Password locked.', Severity.ERROR)
  static INVALID_CLIENT_UID: KnownCode = new KnownCode(15510, 'Invalid client UID.', Severity.ERROR)
  static CONTACT_FI: KnownCode = new KnownCode(15511, 'User must contact FI.', Severity.ERROR)
  static AUTHTOKEN_REQUIRED: KnownCode = new KnownCode(
    15512,
    'Auth token required.',
    Severity.ERROR
  )
  static INVALID_AUTHTOKEN: KnownCode = new KnownCode(15513, 'Invalid auth token.', Severity.ERROR)
  static NO_DATA: KnownCode = new KnownCode(14701, 'No Tax Data for Account.', Severity.ERROR)
  static DB_EXCEPTION: KnownCode = new KnownCode(
    14702,
    'Database error has occured.',
    Severity.ERROR
  )
  static NO_TAXSUPPORT: KnownCode = new KnownCode(
    14703,
    'This Tax Year is not supported.',
    Severity.ERROR
  )

  static KnownCodes: KnownCode[] = [
    KnownCode.SUCCESS,
    KnownCode.CLIENT_UP_TO_DATE,
    KnownCode.GENERAL_ERROR,
    KnownCode.GENERAL_ACCOUNT_ERROR,
    KnownCode.ACCOUNT_NOT_FOUND,
    KnownCode.ACCOUNT_CLOSED,
    KnownCode.ACCOUNT_NOT_AUTHORIZED,
    KnownCode.DATE_TOO_SOON,
    KnownCode.DUPLICATE_REQUEST,
    KnownCode.UNSUPPORTED_VERSION,
    KnownCode.INVALID_TAN,
    KnownCode.MFA_CHALLENGE_REQUIRED,
    KnownCode.MFA_CHALLENGE_FAILED,
    KnownCode.PASSWORD_CHANGE_REQUIRED,
    KnownCode.SIGNON_INVALID,
    KnownCode.CUSTOMER_ACCOUNT_IN_USE,
    KnownCode.PASSWORD_LOCKED,
    KnownCode.INVALID_CLIENT_UID,
    KnownCode.CONTACT_FI,
    KnownCode.AUTHTOKEN_REQUIRED,
    KnownCode.INVALID_AUTHTOKEN,
    KnownCode.NO_DATA,
    KnownCode.DB_EXCEPTION,
    KnownCode.NO_TAXSUPPORT,
  ]

  private code: number
  private message: string
  private defaultSeverity: Severity

  constructor(code: number, message: string, defaultSeverity: Severity) {
    super()
    this.code = code
    this.message = message
    this.defaultSeverity = defaultSeverity
  }

  getCode(): number {
    return this.code
  }

  getMessage(): string {
    return this.message
  }

  getDefaultSeverity(): Severity {
    return this.defaultSeverity
  }

  static fromCode(code: number): KnownCode {
    for (const value of KnownCode.KnownCodes) {
      if (value.getCode() === code) {
        return value
      }
    }
    throw new Error('invalid KnownCode ' + code)
  }

  // @Override
  toString(): string {
    return this.code.toString()
  }
}

/**
 * Transaction status element.
 *
 * @see "Section 3.1.4, OFX Spec"
 */
export class Status {
  private code!: StatusCode
  private severity?: Severity
  private message!: string

  constructor() {
    this.code = KnownCode.SUCCESS
    this.severity = undefined
  }

  /**
   * Status code.
   *
   * @return The status code.
   */
  getCode(): StatusCode {
    return this.code
  }

  /**
   * Status code.
   *
   * @param code Status code.
   */
  setCode(code: StatusCode): void {
    this.code = code
    if (typeof this.severity === 'undefined') {
      this.severity = code.getDefaultSeverity()
    }
  }

  /**
   * The severity.
   *
   * @return The severity.
   */
  getSeverity(): Severity {
    return this.severity!
  }

  /**
   * The severity.
   *
   * @param severity The severity.
   */
  setSeverity(severity: Severity): void {
    this.severity = severity
  }

  /**
   * Server-supplied message.
   *
   * @return Server-supplied message.
   */
  getMessage(): string {
    return this.message
  }

  /**
   * Server-supplied message.
   *
   * @param message Server-supplied message.
   */
  setMessage(message: string): void {
    this.message = message
  }
}

Aggregate_add(Status, 'STATUS')
Element_add(Status, {
  name: 'CODE',
  required: true,
  order: 0,
  type: StatusCode,
  read: Status.prototype.getCode,
  write: Status.prototype.setCode,
})
Element_add(Status, {
  name: 'SEVERITY',
  required: true,
  order: 10,
  type: Severity,
  read: Status.prototype.getSeverity,
  write: Status.prototype.setSeverity,
})
Element_add(Status, {
  name: 'MESSAGE',
  order: 20,
  type: String,
  read: Status.prototype.getMessage,
  write: Status.prototype.setMessage,
})
