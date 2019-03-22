/*
 * Copyright 2012 TheStash
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
import { Aggregate_add } from "../../../../../meta/Aggregate_Add";
import { Element_add } from "../../../../../meta/Element_add";


/**
 * Web Enrollment option containing URL to direct user for web based enrollment, if supported.
 * @author Scott Priddy
 * @see "Section 8.8 OFX Spec"
 */
export class WebEnrollment {

  private url: string;

  /**
   * URL to start enrollment process
   * @return String
   */
  public getUrl(): string {
    return this.url;
  }

  public setUrl(url: string): void {
    this.url = url;
  }

}

Aggregate_add( WebEnrollment, "WEBENROLL" );
Element_add(WebEnrollment, { name: "URL", required: true, order: 0, type: String, read: WebEnrollment.prototype.getUrl, write: WebEnrollment.prototype.setUrl });
