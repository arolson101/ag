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
import {ResponseMessage} from "ResponseMessage";
import {MessageSetType} from "MessageSetType";
/**
 * A message set enclosed in a response envelope.
 *
 * @author Ryan Heaton
 */
export /*abstract*/ class ResponseMessageSet /*implements Comparable<ResponseMessageSet>*/ {

  private version: string;

  public /*abstract*/ getType(): MessageSetType { throw new Error("abstract"); }

  constructor() {
    this.version = "1";
  }

  /**
   * The version of this message set.
   *
   * @return The version of this message set.
   */
  public getVersion(): string {
    return this.version;
  }

  /**
   * The version of this message set.
   *
   * @param version The version of this message set.
   */
  public setVersion(version: string): void {
    this.version = version;
  }

  /**
   * The list of response messages.
   *
   * @return The list of response messages.
   */
  public /*abstract*/ getResponseMessages(): Array<ResponseMessage> { throw new Error("abstract"); }
/*
  // Inherited.
  public compareTo(o: ResponseMessageSet): number {
    return getType().compareTo(o.getType());
  }
*/
  
  public static contentCompare(left: ResponseMessageSet, right: ResponseMessageSet): number {
    return left.getType() - right.getType();
  }
}


