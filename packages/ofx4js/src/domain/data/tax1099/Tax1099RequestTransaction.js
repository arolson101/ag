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

var inherit = require("../../../util/inherit");

var TransactionWrappedRequestMessage = require("../TransactionWrappedRequestMessage");
var Aggregate = require("../../../meta/Aggregate");
var ChildAggregate = require("../../../meta/ChildAggregate");
var Tax1099Request = require("./Tax1099Request");

/**
 * @class
 * @augments TransactionWrappedRequestMessage
 */
function Tax1099RequestTransaction () {
  TransactionWrappedRequestMessage.call(this);

  /**
   * @name Tax1099RequestTransaction#tax1099Request
   * @type Tax1099Request
   * @access private
   */
  this.tax1099Request = null;
}

inherit(Tax1099RequestTransaction, "extends", TransactionWrappedRequestMessage);


Aggregate.add("TAX1099TRNRQ", Tax1099RequestTransaction);


/**
 * The tax1099Request.
 *
 * @return {Tax1099Request} The tax1099Request.
 */
Tax1099RequestTransaction.prototype.getTax1099Request = function() {
  return this.tax1099Request;
};
ChildAggregate.add(Tax1099RequestTransaction, {required: true, order: 30, attributeType: Tax1099Request, readMethod: "getTax1099Request", writeMethod: "setTax1099Request"});


/**
 * The tax1099Request.
 *
 * @param {Tax1099Request} tax1099Request The message.
 *
 */
Tax1099RequestTransaction.prototype.setTax1099Request = function(tax1099Request) {
  this.tax1099Request = tax1099Request;
};


// Inherited.
Tax1099RequestTransaction.prototype.setWrappedMessage = function(/*Tax1099Request*/ tax1099Request) {
  this.setTax1099Request(tax1099Request);
};




module.exports = Tax1099RequestTransaction;
