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
///<reference path='MessageSetType'/>
///<reference path='RequestMessage'/>

module ofx4js.domain.data {

/**
 * A message set enclosed in an OFX request envelope.
 *
 * @author Ryan Heaton
 */
export /*abstract*/ class RequestMessageSet /*implements Comparable<RequestMessageSet>*/ {

  private version: string;

  public /*abstract*/ getType(): MessageSetType { throw new OFXException("abstract"); }

  constructor() {
    this.version = "1";
  }

  /**
   * The version of this request message.
   *
   * @return The version of this request message.
   */
  public getVersion(): string {
    return this.version;
  }

  /**
   * The version of this request message.
   *
   * @param version The version of this request message.
   */
  public setVersion(version: string): void {
    this.version = version;
  }

  /**
   * The request messages for this request message set.
   *
   * @return The request messages for this request message set.
   */
  public /*abstract*/ getRequestMessages(): Array<RequestMessage> { throw new OFXException("abstract"); }

  // Inherited.
  /*public compareTo(o: RequestMessageSet): number {
    return getType().compareTo(o.getType());
  }*/
  
  public static contentCompare(left: RequestMessageSet, right: RequestMessageSet): number {
    return left.getType() - right.getType();
  }
  
}

}
