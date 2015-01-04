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

var inherit = require("../../../../util/inherit");

var StatementRequest = require("../../common/StatementRequest");
var Aggregate = require("../../../../meta/Aggregate");
var ChildAggregate = require("../../../../meta/ChildAggregate");
var Element = require("../../../../meta/Element");
var InvestmentAccountDetails = require("../accounts/InvestmentAccountDetails");
var IncludePosition = require("./IncludePosition");

/**
 * Aggregate for the investment statement download request.
 * See "Section 13.9.1.1, OFX Spec"
 *
 * @class
 * @augments StatementRequest
 */
function InvestmentStatementRequest () {
  StatementRequest.call(this);

  /**
   * @name InvestmentStatementRequest#account
   * @type InvestmentAccountDetails
   * @access private
   */
  this.account = null;

  /**
   * @name InvestmentStatementRequest#includeOpenOrders
   * @type Boolean
   * @access private
   */
  this.includeOpenOrders = Boolean.FALSE;

  /**
   * @name InvestmentStatementRequest#includePosition
   * @type IncludePosition
   * @access private
   */
  this.includePosition = null;

  /**
   * @name InvestmentStatementRequest#includeBalance
   * @type Boolean
   * @access private
   */
  this.includeBalance = Boolean.TRUE;
}

inherit(InvestmentStatementRequest, "extends", StatementRequest);


Aggregate.add("INVSTMTRQ", InvestmentStatementRequest);


/**
 * The account details.
 *
 * @return {InvestmentAccountDetails} The account details.
 */
InvestmentStatementRequest.prototype.getAccount = function() {
  return this.account;
};
ChildAggregate.add(InvestmentStatementRequest, {name: "INVACCTFROM", required: true, order: 0, attributeType: InvestmentAccountDetails, readMethod: "getAccount", writeMethod: "setAccount"});


/**
 * The account details.
 *
 * @param {InvestmentAccountDetails} account The account details.
 */
InvestmentStatementRequest.prototype.setAccount = function(account) {
  this.account = account;
};


/**
 * Gets whether to include open orders. This is an optional field according to the OFX spec.
 * <br>
 * Note, open orders are not yet implemented.
 *
 * @return {Boolean} whether to include open orders
 */
InvestmentStatementRequest.prototype.getIncludeOpenOrders = function() {
  return this.includeOpenOrders;
};
Element.add(InvestmentStatementRequest, {name: "INCOO", order: 20, attributeType: Boolean, readMethod: "getIncludeOpenOrders", writeMethod: "setIncludeOpenOrders"});


/**
 * Sets whether to include open orders. This is an optional field according to the OFX spec.
 * <br>
 * Note, open orders are not yet implemented.
 *
 * @param {Boolean} includeOpenOrders whether to include open orders
 */
InvestmentStatementRequest.prototype.setIncludeOpenOrders = function(includeOpenOrders) {
  this.includeOpenOrders = includeOpenOrders;
};


/**
 * Gets the include position child aggregate. This is a required field according to the OFX spec.
 *
 * @return {IncludePosition} the include position child aggregate
 */
InvestmentStatementRequest.prototype.getIncludePosition = function() {
  return this.includePosition;
};
ChildAggregate.add(InvestmentStatementRequest, {name: "INCPOS", required: true, order: 30, attributeType: IncludePosition, readMethod: "getIncludePosition", writeMethod: "setIncludePosition"});


/**
 * Gets the include position child aggregate. This is a required field according to the OFX spec.
 *
 * @param {IncludePosition} includePosition the include position child aggregate
 */
InvestmentStatementRequest.prototype.setIncludePosition = function(includePosition) {
  this.includePosition = includePosition;
};


/**
 * Gets whether to include balance info in the response. This is a required field according to
 * the OFX spec.
 *
 * @return {Boolean} whether to include balance info in the response
 */
InvestmentStatementRequest.prototype.getIncludeBalance = function() {
  return this.includeBalance;
};
Element.add(InvestmentStatementRequest, {name: "INCBAL", required: true, order: 40, attributeType: Boolean, readMethod: "getIncludeBalance", writeMethod: "setIncludeBalance"});


/**
 * Sets whether to include balance info in the response. This is a required field according to
 * the OFX spec.
 *
 * @param {Boolean} includeBalance whether to include balance info in the response
 */
InvestmentStatementRequest.prototype.setIncludeBalance = function(includeBalance) {
  this.includeBalance = includeBalance;
};




module.exports = InvestmentStatementRequest;
