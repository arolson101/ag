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

var SubAccountType = require("../accounts/SubAccountType");
var Inv401KSource = require("../positions/Inv401KSource");
var Aggregate = require("../../../../meta/Aggregate");
var ChildAggregate = require("../../../../meta/ChildAggregate");
var Element = require("../../../../meta/Element");
var BaseOtherInvestmentTransaction = require("./BaseOtherInvestmentTransaction");
var TransactionWithSecurity = require("./TransactionWithSecurity");
var TransactionType = require("./TransactionType");
var IncomeType = require("./IncomeType");
var SecurityId = require("../../seclist/SecurityId");
var OriginalCurrency = require("./OriginalCurrency");

/**
 * Transaction for investment income that is realized as cash into the investment account.
 * @see "Section 13.9.2.4.4, OFX Spec"
 *
 * @class
 * @augments BaseOtherInvestmentTransaction
 * @augments TransactionWithSecurity
 */
function IncomeTransaction () {
  BaseOtherInvestmentTransaction.call(this, TransactionType.INCOME);

  /**
   * @name IncomeTransaction#securityId
   * @type SecurityId
   * @access private
   */
  this.securityId = null;

  /**
   * @name IncomeTransaction#incomeType
   * @type String
   * @access private
   */
  this.incomeType = null;

  /**
   * @name IncomeTransaction#total
   * @type Double
   * @access private
   */
  this.total = null;

  /**
   * @name IncomeTransaction#subAccountSecurity
   * @type String
   * @access private
   */
  this.subAccountSecurity = null;

  /**
   * @name IncomeTransaction#subAccountFund
   * @type String
   * @access private
   */
  this.subAccountFund = null;

  /**
   * @name IncomeTransaction#taxExempt
   * @type Boolean
   * @access private
   */
  this.taxExempt = null;

  /**
   * @name IncomeTransaction#withholding
   * @type Double
   * @access private
   */
  this.withholding = null;

  /**
   * @name IncomeTransaction#currencyCode
   * @type String
   * @access private
   */
  this.currencyCode = null;

  /**
   * @name IncomeTransaction#originalCurrencyInfo
   * @type OriginalCurrency
   * @access private
   */
  this.originalCurrencyInfo = null;

  /**
   * @name IncomeTransaction#inv401kSource
   * @type String
   * @access private
   */
  this.inv401kSource = null;
}

inherit(IncomeTransaction, "extends", BaseOtherInvestmentTransaction);
inherit(IncomeTransaction, "implements", TransactionWithSecurity);


Aggregate.add("INCOME", IncomeTransaction);



/**
 * Gets the id of the security that the income was for. This is a required field according to the
 * OFX spec.
 * @see "Section 13.9.2.4.4, OFX Spec"
 *
 * @return {SecurityId} the security id of the security that the income was for
 */
IncomeTransaction.prototype.getSecurityId = function() {
  return this.securityId;
};
ChildAggregate.add(IncomeTransaction, {required: true, order: 20, attributeType: SecurityId, readMethod: "getSecurityId", writeMethod: "setSecurityId"});


/**
 * Sets the id of the security that the income was for. This is a required field according to the
 * OFX spec.
 * @see "Section 13.9.2.4.4, OFX Spec"
 *
 * @param {SecurityId} securityId the security id of the security that the income was for
 */
IncomeTransaction.prototype.setSecurityId = function(securityId) {
  this.securityId = securityId;
};


/**
 * Gets the type of income. One of "CGLONG" (long term capital gains), "CGSHORT" (short term
 * capital gains), "DIV" (dividend), INTEREST, or MISC>
 * @see "Section 13.9.2.4.4, OFX Spec" This is a required field according to the OFX spec.
 *
 * @return {String} the type of income
 */
IncomeTransaction.prototype.getIncomeType = function() {
  return this.incomeType;
};
Element.add(IncomeTransaction, {name: "INCOMETYPE", required: true, order: 30, attributeType: String, readMethod: "getIncomeType", writeMethod: "setIncomeType"});


/**
 * Sets the type of income. One of "CGLONG" (long term capital gains), "CGSHORT" (short term
 * capital gains), "DIV" (dividend), INTEREST, or MISC>
 * @see "Section 13.9.2.4.4, OFX Spec" This is a required field according to the OFX spec.
 *
 * @param {String} incomeType the type of income
 */
IncomeTransaction.prototype.setIncomeType = function(incomeType) {
  this.incomeType = incomeType;
};


/**
 * Gets the income type as one of the well-known types.
 *
 * @return {IncomeType} the income type or null if it's not well known
 */
IncomeTransaction.prototype.getIncomeTypeEnum = function() {
  return IncomeType.fromOfx(this.getIncomeType());
};


/**
 * Gets the total income received.
 * @see "Section 13.9.2.4.4, OFX Spec"
 *
 * @return {Double} the total
 */
IncomeTransaction.prototype.getTotal = function() {
  return this.total;
};
Element.add(IncomeTransaction, {name: "TOTAL", required: true, order: 40, attributeType: Number, readMethod: "getTotal", writeMethod: "setTotal"});


/**
 * Sets the total income received.
 * @see "Section 13.9.2.4.4, OFX Spec"
 *
 * @param {Double} total the total
 */
IncomeTransaction.prototype.setTotal = function(total) {
  this.total = total;
};


/**
 * Gets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER).
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {String} the sub account type
 */
IncomeTransaction.prototype.getSubAccountSecurity = function() {
  return this.subAccountSecurity;
};
Element.add(IncomeTransaction, {name: "SUBACCTSEC", order: 50, attributeType: String, readMethod: "getSubAccountSecurity", writeMethod: "setSubAccountSecurity"});


/**
 * Sets the sub account type for the security (e.g. CASH, MARGIN, SHORT, OTHER).
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {String} subAcctSec the sub account type
 */
IncomeTransaction.prototype.setSubAccountSecurity = function(subAcctSec) {
  this.subAccountSecurity = subAcctSec;
};


/**
 * Gets the result of getSubAccountSecurity as one of the well-known types.
 *
 * @return {SubAccountType} the type of null if it wasn't one of the well known types.
 */
IncomeTransaction.prototype.getSubAccountSecurityEnum = function() {
  return SubAccountType.fromOfx(this.getSubAccountSecurity());
};


/**
 * Gets the sub account type that the security is from (e.g. CASH, MARGIN, SHORT, OTHER).
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {String} the sub account fund for the transaction
 */
IncomeTransaction.prototype.getSubAccountFund = function() {
  return this.subAccountFund;
};
Element.add(IncomeTransaction, {name: "SUBACCTFUND", order: 60, attributeType: String, readMethod: "getSubAccountFund", writeMethod: "setSubAccountFund"});


/**
 * Sets the sub account type that the security is from (e.g. CASH, MARGIN, SHORT, OTHER).
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {String} subAcctFund the sub account fund for the transaction
 */
IncomeTransaction.prototype.setSubAccountFund = function(subAcctFund) {
  this.subAccountFund = subAcctFund;
};


/**
 * Gets the result of getSubAccountFund as one of the well-known types.
 *
 * @return {SubAccountType} the type of null if it wasn't one of the well known types
 */
IncomeTransaction.prototype.getSubAccountFundEnum = function() {
  return SubAccountType.fromOfx(this.getSubAccountFund());
};


/**
 * Gets whether the income was tax exempt. This is an optional field according to the OFX spec.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {Boolean} whether the transaction was tax exempt
 */
IncomeTransaction.prototype.getTaxExempt = function() {
  return this.taxExempt;
};
Element.add(IncomeTransaction, {name: "TAXEXEMPT", order: 70, attributeType: Boolean, readMethod: "getTaxExempt", writeMethod: "setTaxExempt"});


/**
 * Sets whether the income was tax exempt. This is an optional field according to the OFX spec.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {Boolean} taxExempt whether the transaction was tax exempt
 */
IncomeTransaction.prototype.setTaxExempt = function(taxExempt) {
  this.taxExempt = taxExempt;
};


/**
 * Gets the withholding for the income. This is an optional field according to the OFX spec.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {Double} the withholding
 */
IncomeTransaction.prototype.getWithholding = function() {
  return this.withholding;
};
Element.add(IncomeTransaction, {name: "WITHHOLDING", order: 80, attributeType: Number, readMethod: "getWithholding", writeMethod: "setWithholding"});


/**
 * Sets the withholding for the income. This is an optional field according to the OFX spec.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {Double} withholding the withholding
 */
IncomeTransaction.prototype.setWithholding = function(withholding) {
  this.withholding = withholding;
};


/**
 * Gets the currency code for the transaction. Only one of currency code or original currency
 * info should be set according to the OFX spec. If neither are set, means the default currency.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {String} the currency code for the transaction
 */
IncomeTransaction.prototype.getCurrencyCode = function() {
  return this.currencyCode;
};
Element.add(IncomeTransaction, {name: "CURRENCY", order: 90, attributeType: String, readMethod: "getCurrencyCode", writeMethod: "setCurrencyCode"});


/**
 * Sets the currency code for the transaction. Only one of currency code or original currency
 * info should be set according to the OFX spec. If neither are set, means the default currency.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {String} currencyCode the currency code for the transaction
 */
IncomeTransaction.prototype.setCurrencyCode = function(currencyCode) {
  this.currencyCode = currencyCode;
  this.originalCurrencyInfo = null;
};


/**
 * Gets the original currency info for the transaction.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {OriginalCurrency} the currency info for the transaction
 */
IncomeTransaction.prototype.getOriginalCurrencyInfo = function() {
  return this.originalCurrencyInfo;
};
ChildAggregate.add(IncomeTransaction, {order: 120, attributeType: OriginalCurrency, readMethod: "getOriginalCurrencyInfo", writeMethod: "setOriginalCurrencyInfo"});


/**
 * Sets the original currency info for the transaction.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {OriginalCurrency} originalCurrencyInfo the currency info for the transaction
 */
IncomeTransaction.prototype.setOriginalCurrencyInfo = function(originalCurrencyInfo) {
  this.originalCurrencyInfo = originalCurrencyInfo;
  this.currencyCode = null;
};


/**
 * Gets the 401K source for the sale. Should be one of "PRETAX", "AFTERTAX", "MATCH",
 * "PROFITSHARING", "ROLLOVER", "OTHERVEST", "OTHERNONVEST".  This is an optional field
 * according to the OFX spec.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @return {String} the state withholding
 */
IncomeTransaction.prototype.get401kSource = function() {
  return this.inv401kSource;
};
Element.add(IncomeTransaction, {name: "INV401KSOURCE", order: 110, attributeType: String, readMethod: "get401kSource", writeMethod: "set401kSource"});


/**
 * Sets the 401K source for the sale. Should be one of "PRETAX", "AFTERTAX", "MATCH",
 * "PROFITSHARING", "ROLLOVER", "OTHERVEST", "OTHERNONVEST".  This is an optional field
 * according to the OFX spec.
 * @see "Section 13.9.2.4.3, OFX Spec"
 *
 * @param {String} inv401kSource the state withholding
 */
IncomeTransaction.prototype.set401kSource = function(inv401kSource) {
  this.inv401kSource = inv401kSource;
};


/**
 * Gets the 401(k) source as one of the well-known types.
 *
 * @return {Inv401KSource} the type of close or null if it's not well known.
 */
IncomeTransaction.prototype.get401kSourceEnum = function() {
  return Inv401KSource.fromOfx(this.get401kSource());
};




module.exports = IncomeTransaction;