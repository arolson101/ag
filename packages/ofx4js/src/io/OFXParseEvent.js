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
 * An event during OFX parsing.
 *
 * @class
 */
function OFXParseEvent () {

  /**
   * @name OFXParseEvent#eventType
   * @type Type
   * @access private
   */
  this.eventType = null;

  /**
   * @name OFXParseEvent#eventValue
   * @type String
   * @access private
   */
  this.eventValue = null;
}





OFXParseEvent.Type = {

  CHARACTERS: 0,

  ELEMENT: 1
};

OFXParseEvent.prototype.OFXParseEvent = function(/*Type*/ eventType, /*String*/ eventValue) {
  this.eventType = eventType;
  this.eventValue = eventValue;
};


OFXParseEvent.prototype.getEventType = function() {
  return this.eventType;
};


OFXParseEvent.prototype.getEventValue = function() {
  return this.eventValue;
};




module.exports = OFXParseEvent;