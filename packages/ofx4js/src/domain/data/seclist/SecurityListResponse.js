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

var inherit = require("../inherit");

var ResponseMessage = require("domain/data/ResponseMessage");
var Aggregate = require("meta/Aggregate");

/**
 * Security list response. This is an empty aggregate. The actual security information is included
 * in the "SECLIST" aggregate.
 * @see "Section 13.8.3, OFX Spec"
 *
 * @class
 * @augments ResponseMessage
 */
function SecurityListResponse () {
}

inherit(SecurityListResponse, "extends", ResponseMessage);


Aggregate.add("SECLISTRS", SecurityListResponse);


SecurityListResponse.prototype.getResponseMessageName = function() {
  return "security list";
};




module.exports = SecurityListResponse;
