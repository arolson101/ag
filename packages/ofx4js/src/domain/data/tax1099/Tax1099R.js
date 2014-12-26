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

var Aggregate = require("../../../meta/Aggregate");
var ChildAggregate = require("../../../meta/ChildAggregate");

var Element = require("../../../meta/Element");

/**
 * @class
 */
function Tax1099R () {

  /**
   * @name Tax1099R#srvrtId
   * @type String
   * @access private
   */
  this.srvrtId = null;

  /**
   * @name Tax1099R#taxYear
   * @type String
   * @access private
   */
  this.taxYear = null;

  /**
   * @name Tax1099R#grossDist
   * @type String
   * @access private
   */
  this.grossDist = null;

  /**
   * @name Tax1099R#taxAmt
   * @type String
   * @access private
   */
  this.taxAmt = null;

  /**
   * @name Tax1099R#taxAmtNd
   * @type String
   * @access private
   */
  this.taxAmtNd = null;

  /**
   * @name Tax1099R#capGain
   * @type String
   * @access private
   */
  this.capGain = null;

  /**
   * @name Tax1099R#fedTaxWh
   * @type String
   * @access private
   */
  this.fedTaxWh = null;

  /**
   * @name Tax1099R#empContins
   * @type String
   * @access private
   */
  this.empContins = null;

  /**
   * @name Tax1099R#netUnapEmp
   * @type String
   * @access private
   */
  this.netUnapEmp = null;

  /**
   * @name Tax1099R#distCode
   * @type String
   * @access private
   */
  this.distCode = null;

  /**
   * @name Tax1099R#iraSepSimp
   * @type String
   * @access private
   */
  this.iraSepSimp = null;

  /**
   * @name Tax1099R#annCtrctDist
   * @type String
   * @access private
   */
  this.annCtrctDist = null;

  /**
   * @name Tax1099R#totEmpCount
   * @type String
   * @access private
   */
  this.totEmpCount = null;

  /**
   * @name Tax1099R#payerAddress
   * @type PayerAddress
   * @access private
   */
  this.payerAddress = null;

  /**
   * @name Tax1099R#payerId
   * @type String
   * @access private
   */
  this.payerId = null;

  /**
   * @name Tax1099R#recAddress
   * @type RecAddress
   * @access private
   */
  this.recAddress = null;

  /**
   * @name Tax1099R#recId
   * @type String
   * @access private
   */
  this.recId = null;

  /**
   * @name Tax1099R#recAcct
   * @type String
   * @access private
   */
  this.recAcct = null;
}



Aggregate.add("TAX1099R_V100", Tax1099R);


Tax1099R.prototype.getSrvrtId = function() {
  return this.srvrtId;
};
Element.add(Tax1099R, {name: "SRVRTID",required: true , order: 0, attributeType: String, readMethod: "getSrvrtId", writeMethod: "setSrvrtId"});


Tax1099R.prototype.setSrvrtId = function(/*String*/ srvrtId) {
  this.srvrtId = srvrtId;
};


Tax1099R.prototype.getTaxYear = function() {
  return this.taxYear;
};
Element.add(Tax1099R, {name: "TAXYEAR", required: true, order: 1, attributeType: String, readMethod: "getTaxYear", writeMethod: "setTaxYear"});


Tax1099R.prototype.setTaxYear = function(/*String*/ taxYear) {
  this.taxYear = taxYear;
};


/**
 * @return {String} the grossDist
 */
Tax1099R.prototype.getGrossDist = function() {
  return this.grossDist;
};
Element.add(Tax1099R, {name: "GROSSDIST", required: true, order: 2, attributeType: String, readMethod: "getGrossDist", writeMethod: "setGrossDist"});


/**
 * @param {String} grossDist the grossDist to set
 */
Tax1099R.prototype.setGrossDist = function(grossDist) {
  this.grossDist = grossDist;
};


/**
 * @return {String} the taxAmt
 */
Tax1099R.prototype.getTaxAmt = function() {
  return this.taxAmt;
};
Element.add(Tax1099R, {name: "TAXAMT", required: false, order: 3, attributeType: String, readMethod: "getTaxAmt", writeMethod: "setTaxAmt"});


/**
 * @param {String} taxAmt the taxAmt to set
 */
Tax1099R.prototype.setTaxAmt = function(taxAmt) {
  this.taxAmt = taxAmt;
};


/**
 * @return {String} the taxAmtNd
 */
Tax1099R.prototype.getTaxAmtNd = function() {
  return this.taxAmtNd;
};
Element.add(Tax1099R, {name: "TAXAMTND", required: false, order: 4, attributeType: String, readMethod: "getTaxAmtNd", writeMethod: "setTaxAmtNd"});


/**
 * @param {String} taxAmtNd the taxAmtNd to set
 */
Tax1099R.prototype.setTaxAmtNd = function(taxAmtNd) {
  this.taxAmtNd = taxAmtNd;
};


/**
 * @return {String} the capGain
 */
Tax1099R.prototype.getCapGain = function() {
  return this.capGain;
};
Element.add(Tax1099R, {name: "CAPGAIN", required: false, order: 5, attributeType: String, readMethod: "getCapGain", writeMethod: "setCapGain"});


/**
 * @param {String} capGain the capGain to set
 */
Tax1099R.prototype.setCapGain = function(capGain) {
  this.capGain = capGain;
};


/**
 * @return {String} the fedTaxWh
 */
Tax1099R.prototype.getFedTaxWh = function() {
  return this.fedTaxWh;
};
Element.add(Tax1099R, {name: "FEDTAXWH", required: false, order: 6, attributeType: String, readMethod: "getFedTaxWh", writeMethod: "setFedTaxWh"});


/**
 * @param {String} fedTaxWh the fedTaxWh to set
 */
Tax1099R.prototype.setFedTaxWh = function(fedTaxWh) {
  this.fedTaxWh = fedTaxWh;
};


/**
 * @return {String} the empContins
 */
Tax1099R.prototype.getEmpContins = function() {
  return this.empContins;
};
Element.add(Tax1099R, {name: "EMPCONTINS", required: false, order: 7, attributeType: String, readMethod: "getEmpContins", writeMethod: "setEmpContins"});


/**
 * @param {String} empContins the empContins to set
 */
Tax1099R.prototype.setEmpContins = function(empContins) {
  this.empContins = empContins;
};


/**
 * @return {String} the netUnapEmp
 */
Tax1099R.prototype.getNetUnapEmp = function() {
  return this.netUnapEmp;
};
Element.add(Tax1099R, {name: "NETUNAPEMP", required: false, order: 8, attributeType: String, readMethod: "getNetUnapEmp", writeMethod: "setNetUnapEmp"});


/**
 * @param {String} netUnapEmp the netUnapEmp to set
 */
Tax1099R.prototype.setNetUnapEmp = function(netUnapEmp) {
  this.netUnapEmp = netUnapEmp;
};


/**
 * @return {String} the distCode
 */
Tax1099R.prototype.getDistCode = function() {
  return this.distCode;
};
Element.add(Tax1099R, {name: "DISTCODE", required: true, order: 9, attributeType: String, readMethod: "getDistCode", writeMethod: "setDistCode"});


/**
 * @param {String} distCode the distCode to set
 */
Tax1099R.prototype.setDistCode = function(distCode) {
  this.distCode = distCode;
};


/**
 * @return {String} the iraSepSimp
 */
Tax1099R.prototype.getIraSepSimp = function() {
  return this.iraSepSimp;
};
Element.add(Tax1099R, {name: "IRASEPSIMP", required: true, order: 10, attributeType: String, readMethod: "getIraSepSimp", writeMethod: "setIraSepSimp"});


/**
 * @param {String} iraSepSimp the iraSepSimp to set
 */
Tax1099R.prototype.setIraSepSimp = function(iraSepSimp) {
  this.iraSepSimp = iraSepSimp;
};


/**
 * @return {String} the annCtrctDist
 */
Tax1099R.prototype.getAnnCtrctDist = function() {
  return this.annCtrctDist;
};
Element.add(Tax1099R, {name: "ANNCTRCTDIST", required: false, order: 11, attributeType: String, readMethod: "getAnnCtrctDist", writeMethod: "setAnnCtrctDist"});


/**
 * @param {String} annCtrctDist the annCtrctDist to set
 */
Tax1099R.prototype.setAnnCtrctDist = function(annCtrctDist) {
  this.annCtrctDist = annCtrctDist;
};


/**
 * @return {String} the totEmpCount
 */
Tax1099R.prototype.getTotEmpCount = function() {
  return this.totEmpCount;
};
Element.add(Tax1099R, {name: "TOTEMPCONT", required: false, order: 12, attributeType: String, readMethod: "getTotEmpCount", writeMethod: "setTotEmpCount"});


/**
 * @param {String} totEmpCount the totEmpCount to set
 */
Tax1099R.prototype.setTotEmpCount = function(totEmpCount) {
  this.totEmpCount = totEmpCount;
};


/**
 * @return {PayerAddress} the payerAddress
 */
Tax1099R.prototype.getPayerAddress = function() {
  return this.payerAddress;
};
ChildAggregate.add(Tax1099R, {required:true, order: 13, attributeType: PayerAddress, readMethod: "getPayerAddress", writeMethod: "setPayerAddress"});


/**
 * @param {PayerAddress} payerAddress the payerAddress to set
 */
Tax1099R.prototype.setPayerAddress = function(payerAddress) {
  this.payerAddress = payerAddress;
};


/**
 * @return {String} the payerId
 */
Tax1099R.prototype.getPayerId = function() {
  return this.payerId;
};
Element.add(Tax1099R, {name: "PAYERID", required: true, order: 14, attributeType: String, readMethod: "getPayerId", writeMethod: "setPayerId"});


/**
 * @param {String} payerId the payerId to set
 */
Tax1099R.prototype.setPayerId = function(payerId) {
  this.payerId = payerId;
};


/**
 * @return {RecAddress} the recAddress
 */
Tax1099R.prototype.getRecAddress = function() {
  return this.recAddress;
};
ChildAggregate.add(Tax1099R, {required:true, order: 15, attributeType: RecAddress, readMethod: "getRecAddress", writeMethod: "setRecAddress"});


/**
 * @param {RecAddress} recAddress the recAddress to set
 */
Tax1099R.prototype.setRecAddress = function(recAddress) {
  this.recAddress = recAddress;
};


/**
 * @return {String} the recId
 */
Tax1099R.prototype.getRecId = function() {
  return this.recId;
};
Element.add(Tax1099R, {name: "RECID", required: true, order: 16, attributeType: String, readMethod: "getRecId", writeMethod: "setRecId"});


/**
 * @param {String} recId the recId to set
 */
Tax1099R.prototype.setRecId = function(recId) {
  this.recId = recId;
};


/**
 * @return {String} the recAcct
 */
Tax1099R.prototype.getRecAcct = function() {
  return this.recAcct;
};
Element.add(Tax1099R, {name: "RECACCT", required: true, order: 17, attributeType: String, readMethod: "getRecAcct", writeMethod: "setRecAcct"});


/**
 * @param {String} recAcct the recAcct to set
 */
Tax1099R.prototype.setRecAcct = function(recAcct) {
  this.recAcct = recAcct;
};




module.exports = Tax1099R;
