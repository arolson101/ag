/*
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

"use strict";

/**
 * The type of debt.
 * @see "Section 13.8.5.6, OFX Spec"
 *
 * @enum
 */
var StockType = {
  COMMON: 0,
  PREFERRED: 1,
  CONVERTIBLE: 2,
  OTHER: 3,

  fromOfx: function(/*String*/ ofxVal) {
    if ("COMMON".equals(ofxVal)) {
      return StockType.COMMON;
    } else if ("PREFERRED".equals(ofxVal)) {
      return StockType.PREFERRED;
    } else if ("CONVERTIBLE".equals(ofxVal)) {
      return StockType.CONVERTIBLE;
    } else if ("OTHER".equals(ofxVal)) {
      return StockType.OTHER;
    } else {
      return null;
    }
  }
};


module.exports = StockType;