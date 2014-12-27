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
var Element = require("../../../meta/Element");

/**
 * @class
 */
function ProcDet () {

  /**
   * @name ProcDet#dtAqd
   * @type String
   * @access private
   */
  this.dtAqd = null;

  /**
   * @name ProcDet#dtSale
   * @type String
   * @access private
   */
  this.dtSale = null;

  /**
   * @name ProcDet#secName
   * @type String
   * @access private
   */
  this.secName = null;

  /**
   * @name ProcDet#costBasis
   * @type String
   * @access private
   */
  this.costBasis = null;

  /**
   * @name ProcDet#saleSpr
   * @type String
   * @access private
   */
  this.saleSpr = null;

  /**
   * @name ProcDet#longShort
   * @type String
   * @access private
   */
  this.longShort = null;

  /**
   * @name ProcDet#wasDisAllowed
   * @type String
   * @access private
   */
  this.wasDisAllowed = null;

  /**
   * @name ProcDet#noncoveredSec
   * @type String
   * @access private
   */
  this.noncoveredSec = null;

  /**
   * @name ProcDet#basisNotshown
   * @type String
   * @access private
   */
  this.basisNotshown = null;
}



Aggregate.add("PROCDET_V100", ProcDet);


/**
 * @return {String} the dtAqd
 */
ProcDet.prototype.getDtAqd = function() {
  return this.dtAqd;
};
Element.add(ProcDet, {name: "DTAQD", required: false, order: 0, attributeType: String, readMethod: "getDtAqd", writeMethod: "setDtAqd"});


/**
 * @param {String} dtAqd the dtAqd to set
 */
ProcDet.prototype.setDtAqd = function(dtAqd) {
  this.dtAqd = dtAqd;
};


/**
 * @return {String} the dtSale
 */
ProcDet.prototype.getDtSale = function() {
  return this.dtSale;
};
Element.add(ProcDet, {name: "DTSALE", required: false, order: 2, attributeType: String, readMethod: "getDtSale", writeMethod: "setDtSale"});


/**
 * @param {String} dtSale the dtSale to set
 */
ProcDet.prototype.setDtSale = function(dtSale) {
  this.dtSale = dtSale;
};


/**
 * @return {String} the secName
 */
ProcDet.prototype.getSecName = function() {
  return this.secName;
};
Element.add(ProcDet, {name: "SECNAME", required: false, order: 3, attributeType: String, readMethod: "getSecName", writeMethod: "setSecName"});


/**
 * @param {String} secName the secName to set
 */
ProcDet.prototype.setSecName = function(secName) {
  this.secName = secName;
};


/**
 * @return {String} the costBasis
 */
ProcDet.prototype.getCostBasis = function() {
  return this.costBasis;
};
Element.add(ProcDet, {name: "COSTBASIS", required: false, order: 4, attributeType: String, readMethod: "getCostBasis", writeMethod: "setCostBasis"});


/**
 * @param {String} costBasis the costBasis to set
 */
ProcDet.prototype.setCostBasis = function(costBasis) {
  this.costBasis = costBasis;
};


/**
 * @return {String} the saleSpr
 */
ProcDet.prototype.getSaleSpr = function() {
  return this.saleSpr;
};
Element.add(ProcDet, {name: "SALESPR", required: false, order: 5, attributeType: String, readMethod: "getSaleSpr", writeMethod: "setSaleSpr"});


/**
 * @param {String} saleSpr the saleSpr to set
 */
ProcDet.prototype.setSaleSpr = function(saleSpr) {
  this.saleSpr = saleSpr;
};


/**
 * @return {String} the longShort
 */
ProcDet.prototype.getLongShort = function() {
  return this.longShort;
};
Element.add(ProcDet, {name: "LONGSHORT", required: false, order: 6, attributeType: String, readMethod: "getLongShort", writeMethod: "setLongShort"});


/**
 * @param {String} longShort the longShort to set
 */
ProcDet.prototype.setLongShort = function(longShort) {
  this.longShort = longShort;
};


/**
 * @return {String} the wasDisAllowed
 */
ProcDet.prototype.getWasDisAllowed = function() {
  return this.wasDisAllowed;
};
Element.add(ProcDet, {name: "WASHSALELOSSDISALLOWED", required: false, order: 7, attributeType: String, readMethod: "getWasDisAllowed", writeMethod: "setWasDisAllowed"});


/**
 * @param {String} wasDisAllowed the wasDisAllowed to set
 */
ProcDet.prototype.setWasDisAllowed = function(wasDisAllowed) {
  this.wasDisAllowed = wasDisAllowed;
};


/**
 * @return {String} the noncoveredSec
 */
ProcDet.prototype.getNoncoveredSec = function() {
  return this.noncoveredSec;
};
Element.add(ProcDet, {name: "NONCOVEREDSECURITY", required: false, order: 8, attributeType: String, readMethod: "getNoncoveredSec", writeMethod: "setNoncoveredSec"});


/**
 * @param {String} noncoveredSec the noncoveredSec to set
 */
ProcDet.prototype.setNoncoveredSec = function(noncoveredSec) {
  this.noncoveredSec = noncoveredSec;
};


/**
 * @return {String} the basisNotshown
 */
ProcDet.prototype.getBasisNotshown = function() {
  return this.basisNotshown;
};
Element.add(ProcDet, {name: "BASISNOTSHOWN", required: false, order: 9, attributeType: String, readMethod: "getBasisNotshown", writeMethod: "setBasisNotshown"});


/**
 * @param {String} basisNotshown the basisNotshown to set
 */
ProcDet.prototype.setBasisNotshown = function(basisNotshown) {
  this.basisNotshown = basisNotshown;
};




module.exports = ProcDet;