import { ok as assert } from 'assert'
import { KnownCode } from '../domain/data/common/Status'
import { Severity, StatusCode } from '../domain/data/common/StatusCode'
import { UnknownStatusCode } from '../domain/data/common/UnknownStatusCode'
import { isAssignableFrom } from '../meta/PropertyDescriptor'
import { StringConversion } from './StringConversion'

/**
 * Utility class for conversion to/from OFX strings.
 */
export class DefaultStringConversion implements StringConversion {
  toString(value: object): string {
    if (!value) {
      throw new Error('null value')
    } else if (typeof value === 'boolean') {
      return value ? 'Y' : 'N'
    } else if (value instanceof Date) {
      return this.formatDate(value)
    } else if (typeof value === 'number') {
      return value + ''
    } else {
      return value.toString()
    }
  }

  fromString<E>(clazz: any, value: string): E {
    if (!value) {
      throw new Error('null value')
    } else if (clazz === StatusCode) {
      const code: number = (value as any) as number
      let statusCode: StatusCode = KnownCode.fromCode(code)
      if (!statusCode) {
        statusCode = new UnknownStatusCode(code, 'Unknown status code.', Severity.ERROR)
      }

      return (statusCode as any) as E
    } else if (isAssignableFrom(Number, clazz)) {
      return (parseFloat(value) as any) as E
    } else if (isAssignableFrom(Boolean, clazz)) {
      return (('Y' === value.toUpperCase()) as any) as E
    } else if (isAssignableFrom(Date, clazz)) {
      return (this.parseDate(value) as any) as E
    }
    // this goes last because a lot of things are objects
    else if (typeof clazz === 'object') {
      // enum
      assert(value in clazz)
      if (value in clazz) {
        return clazz[value]
      }
    }
    return (value as any) as E
  }

  /**
   * Parses a date according to OFX.
   *
   * @param value The value of the date.
   * @return The date value.
   */
  protected parseDate(value: string) {
    const year: number = parseInt(value.substr(0, 4), 10)
    const month: number = parseInt(value.substr(4, 2), 10) - 1 // js month numbers are zero-based
    const day: number = parseInt(value.substr(6, 2), 10)
    let hour: number = parseInt(value.substr(8, 2), 10)
    const minute: number = parseInt(value.substr(10, 2), 10)
    const second: number = parseInt(value.substr(12, 2), 10) || 0
    const milli: number = parseInt(value.substr(15, 3), 10) || 0

    // add timezone offset
    const bracket: number = value.indexOf('[')
    if (bracket !== -1) {
      let close = value.indexOf(':')
      if (close === -1) {
        close = value.indexOf(']')
      }
      const gmtOffset: any = value.substring(bracket + 1, close)
      hour -= 1.0 * gmtOffset
    }

    // create date as UTC
    return new Date(Date.UTC(year, month, day, hour, minute, second, milli))
  }

  /**
   * Format the date according to the OFX spec.
   *
   * @param date The date.
   * @return The date format.
   */
  protected formatDate(date: Date): string {
    const gmt = new Date(date.valueOf() + date.getTimezoneOffset() * 60000)
    return (
      this.pad(gmt.getFullYear(), 4) +
      this.pad(gmt.getMonth() + 1, 2) +
      this.pad(gmt.getDate(), 2) +
      this.pad(gmt.getHours(), 2) +
      this.pad(gmt.getMinutes(), 2) +
      this.pad(gmt.getSeconds(), 2) +
      '.' +
      this.dpad(gmt.getMilliseconds(), 3)
    )
  }

  /**
   * Pad a number with leading zeroes until it is of <tt>size</tt> length
   *
   * @param num number
   * @param size number of digits in final number
   * @return padded number
   */
  private pad(num: number, size: number): string {
    let s = num + ''
    while (s.length < size) {
      s = '0' + s
    }
    return s
  }

  /**
   * Pad a number with trailing zeroes until it is of <tt>size</tt> length.
   * Intended for numbers after a decimal point to get a fixed number of decimals
   *
   * @param num number
   * @param size number of digits in final number
   * @return padded number
   */
  private dpad(num: number, size: number): string {
    let s = num + ''
    while (s.length < size) {
      s = s + '0'
    }
    return s
  }
}
