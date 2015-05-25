/*
 * Copyright 2008 Web Cohesion
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
///<reference path='../domain/data/common/Status'/>
///<reference path='../domain/data/common/StatusCode'/>
///<reference path='../domain/data/common/UnknownStatusCode'/>
///<reference path='../meta/PropertyDescriptor'/>
///<reference path='StringConversion'/>

module ofx4js.io {

import Status = ofx4js.domain.data.common.Status;
import StatusCode = ofx4js.domain.data.common.StatusCode;
import Severity = ofx4js.domain.data.common.Severity;
import KnownCode = ofx4js.domain.data.common.KnownCode;
import UnknownStatusCode = ofx4js.domain.data.common.UnknownStatusCode;
import isAssignableFrom = ofx4js.meta.isAssignableFrom;


/**
 * Utility class for conversion to/from OFX strings.
 *
 * @author Ryan Heaton
 */
export class DefaultStringConversion implements StringConversion {

  public toString(value: Object): string {
    if (!value) {
      return null;
    }
    else if (value instanceof Boolean) {
      return value ? "Y" : "N";
    }
    else if (value instanceof Date) {
      return this.formatDate(value);
    }
    else if (typeof value === "number") {
      return value + "";
    }
    else {
      return value.toString();
    }
  }

  public fromString<E>(clazz: any, value: string): E {
    if (!value) {
      return null;
    }
    else if (clazz === StatusCode) {
      var code: number = <number><any>value;
      var statusCode: StatusCode = KnownCode.fromCode(code);
      if (!statusCode) {
        statusCode = new UnknownStatusCode(code, "Unknown status code.", Severity.ERROR);
      }
      
      return <E><any>statusCode;
    }
    else if (isAssignableFrom(Boolean, clazz)) {
      return <E><any>("Y" === value.toUpperCase());
    }
    else if (isAssignableFrom(Date, clazz)) {
      return <E><any>this.parseDate(value);
    }
    // this goes last because a lot of things are objects
    else if (typeof clazz === "object") {
      // enum
      console.assert(value in clazz);
      if(value in clazz) {
        return clazz[value];
      }
    }
    return <E><any>value;
  }

  /**
   * Parses a date according to OFX.
   *
   * @param value The value of the date.
   * @return The date value.
   */
  protected parseDate(value: string) {
    var year: number = parseInt(value.substr(0, 4));
    var month: number = parseInt(value.substr(4, 2)) - 1; // javascript month numbers are zero-based
    var day: number = parseInt(value.substr(6, 2));
    var hour: number = parseInt(value.substr(8, 2));
    var minute: number = parseInt(value.substr(10, 2));
    var second: number = parseInt(value.substr(12, 2));
    var milli: number = parseInt(value.substr(15, 3));
  
    // add timezone offset
    var bracket: number = value.indexOf("[");
    if(bracket != -1) {
      var close = value.indexOf(":");
      if(close === -1) {
        close = value.indexOf("]");
      }
      var gmtOffset: any = value.substring(bracket+1, close);
      hour -= 1.0 * gmtOffset;
    }
    
    // create date as UTC
    return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
  }

  /**
   * Format the date according to the OFX spec.
   *
   * @param date The date.
   * @return The date format.
   */
  protected formatDate(date: Date): string {
    var gmt = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    return this.pad(gmt.getFullYear(), 4) +
      this.pad(gmt.getMonth() + 1, 2) +
      this.pad(gmt.getDay(), 2) +
      this.pad(gmt.getHours(), 2) +
      this.pad(gmt.getMinutes(), 2) +
      this.pad(gmt.getSeconds(), 2) +
      "." +
      this.dpad(gmt.getMilliseconds(), 3);
  }


  /**
   * Pad a number with leading zeroes until it is of <tt>size</tt> length
   *
   * @param num number
   * @param size number of digits in final number
   * @return padded number
   */
  private pad(num: number, size: number): string {
    var s = num+"";
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
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
    var s = num+"";
    while (s.length < size) {
      s = s + "0";
    }
    return s;
  }
}

}