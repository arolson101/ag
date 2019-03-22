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

"use strict";

var inherit = require("../inherit");

/**
 * Day of week used in "PROCDAYSOFF" lists.
 *
 * @author Scott Priddy
 * @see "OFX Spec, Section 13.6.2"
 */
var ProcessorDayOff = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6;

  fromOfx: function(/*String*/ ofxVal) {
    if ("MONDAY".equals(ofxVal)) {
      return MONDAY;
    } else if ("TUESDAY".equals(ofxVal)) {
      return TUESDAY;
    } else if ("WEDNESDAY".equals(ofxVal)) {
      return WEDNESDAY;
    } else if ("THURSDAY".equals(ofxVal)) {
      return THURSDAY;
    } else if ("FRIDAY".equals(ofxVal)) {
      return FRIDAY;
    } else if ("SATURDAY".equals(ofxVal)) {
      return SATURDAY;
    } else if ("SUNDAY".equals(ofxVal)) {
      return SUNDAY;
    } else {
      return null;
    }
  }
}
;


module.exports = ProcessorDayOff;
