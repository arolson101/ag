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

var TransactionWrappedRequestMessage = require("domain/data/TransactionWrappedRequestMessage");
var ChildAggregate = require("meta/ChildAggregate");
var Aggregate = require("meta/Aggregate");

/**
 * @author Ryan Heaton
 */
function PasswordChangeRequestTransaction () {

  /**
   * @name PasswordChangeRequestTransaction#message
   * @type PasswordChangeRequest
   * @access private
   */
  this.message = null;
}

inherit(PasswordChangeRequestTransaction, "extends", new TransactionWrappedRequestMessage(PasswordChangeRequest));


Aggregate.add("PINCHTRNRQ", PasswordChangeRequestTransaction);


/**
 * The wrapped message.
 *
 * @return {PasswordChangeRequest} The wrapped message.
 */
PasswordChangeRequestTransaction.prototype.getMessage = function() {
  return message;
};
ChildAggregate.add({required: true, order: 30, owner: PasswordChangeRequestTransaction, /*type: PasswordChangeRequest,*/ fcn: "getMessage"});


/**
 * The wrapped message.
 *
 * @param {PasswordChangeRequest} message The wrapped message.
 */
PasswordChangeRequestTransaction.prototype.setMessage = function(message) {
  this.message = message;
};


// Inherited.
PasswordChangeRequestTransaction.prototype.setWrappedMessage = function(/*PasswordChangeRequest*/ message) {
  setMessage(message);
};




module.exports = PasswordChangeRequestTransaction;
