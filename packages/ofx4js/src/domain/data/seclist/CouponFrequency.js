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
 * Coupon freqency for debt.
 * See "Section 13.8.5.2, OFX Spec"
 *
 * @enum
 */
var CouponFrequency = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  SEMIANNUAL: "SEMIANNUAL",
  ANNUAL: "ANNUAL",
  OTHER: "OTHER",

  fromOfx: function(/*String*/ ofxVal) {
    if ("MONTHLY" === ofxVal) {
      return CouponFrequency.MONTHLY;
    } else if ("QUARTERLY" === ofxVal) {
      return CouponFrequency.QUARTERLY;
    } else if ("SEMIANNUAL" === ofxVal) {
      return CouponFrequency.SEMIANNUAL;
    } else if ("ANNUAL" === ofxVal) {
      return CouponFrequency.ANNUAL;
    } else if ("OTHER" === ofxVal) {
      return CouponFrequency.OTHER;
    } else {
      return null;
    }
  }
};


module.exports = CouponFrequency;
