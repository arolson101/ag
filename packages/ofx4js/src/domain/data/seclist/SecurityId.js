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

var Aggregate = require("meta/Aggregate");
var Element = require("meta/Element");

/**
 * Identifier for a security.
 * @see "Section 13.8.1, OFX Spec"
 *
 * @author Jon Perlow
 */
function SecurityId () {

  /**
   * @name SecurityId#uniqueId
   * @type String
   * @access private
   */
  this.uniqueId = null;

  /**
   * @name SecurityId#uniqueIdType
   * @type String
   * @access private
   */
  this.uniqueIdType = null;
}



Aggregate.add("SECID", SecurityId);


/**
 * Gets the unique id for the security. This is a required field according to the OFX spec.
 *
 * @return {String} the unique id
 */
SecurityId.prototype.getUniqueId = function() {
  return uniqueId;
};
Element.add({name: "UNIQUEID", required: true, order: 10, owner: SecurityId, /*type: String,*/ fcn: "getUniqueId"});


/**
 * Sets the unique id for the security. This is a required field according to the OFX spec.
 *
 * @param {String} uniqueId the unique id
 */
SecurityId.prototype.setUniqueId = function(uniqueId) {
  this.uniqueId = uniqueId;
};


/**
 * Gets the type of unique id.
 *
 * @return {String} the type of unique id
 */
SecurityId.prototype.getUniqueIdType = function() {
  return uniqueIdType;
};
Element.add({name: "UNIQUEIDTYPE", required: true, order: 20, owner: SecurityId, /*type: String,*/ fcn: "getUniqueIdType"});


/**
 * Sets the type of unique id.
 *
 * @param {String} uniqueIdType the type of unique id
 */
SecurityId.prototype.setUniqueIdType = function(uniqueIdType) {
  this.uniqueIdType = uniqueIdType;
};




module.exports = SecurityId;
