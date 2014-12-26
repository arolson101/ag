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

var Aggregate = require("../../../../../meta/Aggregate");
var Element = require("../../../../../meta/Element");

/**
 * Funds Transfer Profile
 * @author Scott Priddy
 * @see "Section 11.13.2.2 OFX Spec"
 */
function TransferProfile () {

  /**
   * @name TransferProfile#processorDaysOff
   * @type List<ProcessorDayOff>
   * @access private
   */
  this.processorDaysOff = null;

  /**
   * @name TransferProfile#processEndTime
   * @type String
   * @access private
   */
  this.processEndTime = null;

  /**
   * @name TransferProfile#supportsScheduledTransfers
   * @type Boolean
   * @access private
   */
  this.supportsScheduledTransfers = null;

  /**
   * @name TransferProfile#supportsRecurringTransfers
   * @type Boolean
   * @access private
   */
  this.supportsRecurringTransfers = null;

  /**
   * @name TransferProfile#supportsLoanTransfers
   * @type Boolean
   * @access private
   */
  this.supportsLoanTransfers = null;

  /**
   * @name TransferProfile#supportsScheduledLoanTransfers
   * @type Boolean
   * @access private
   */
  this.supportsScheduledLoanTransfers = null;

  /**
   * @name TransferProfile#supportsRecurringLoanTransfers
   * @type Boolean
   * @access private
   */
  this.supportsRecurringLoanTransfers = null;

  /**
   * @name TransferProfile#supportsTransferModification
   * @type Boolean
   * @access private
   */
  this.supportsTransferModification = null;

  /**
   * @name TransferProfile#supportsModelModification
   * @type Boolean
   * @access private
   */
  this.supportsModelModification = null;

  /**
   * @name TransferProfile#modelWindow
   * @type Integer
   * @access private
   */
  this.modelWindow = null;

  /**
   * @name TransferProfile#withdrawnDays
   * @type Integer
   * @access private
   */
  this.withdrawnDays = null;

  /**
   * @name TransferProfile#defaultDaysToPay
   * @type Integer
   * @access private
   */
  this.defaultDaysToPay = null;
}



Aggregate.add("XFERPROF", TransferProfile);


/**
 * Days of week that no processing occurs: MONDAY, TUESDAY, WEDNESDAY, THURSDAY,
 * FRIDAY, SATURDAY, or SUNDAY. 0 or more <PROCDAYSOFF> can be sent.
 * @return {ProcessorDayOff[]} List of days during the week that no processing occurs.
 */
TransferProfile.prototype.getProcessorDaysOff = function() {
  return this.processorDaysOff;
};
Element.add({name: "PROCDAYSOFF", order: 0, owner: TransferProfile, /*type: ProcessorDayOff[],*/ readMethod: "getProcessorDaysOff", writeMethod: "setProcessorDaysOff"});


TransferProfile.prototype.setProcessorDaysOff = function(/*ProcessorDayOff[]*/ processorDaysOff) {
  this.processorDaysOff = processorDaysOff;
};


/**
 * Gets time of day that day's processing ends.
 *
 * Time formatted as "HHMMSS.XXX[gmt offset[:tz name]]",
 * the milliseconds and time zone are still optional, and default to GMT.
 * @see "Section 3.2.8.3 OFX Spec"
 * @return {String} Time String formatted as "HHMMSS.XXX[gmt offset[:tz name]]"
 */
TransferProfile.prototype.getProcessEndTime = function() {
  return this.processEndTime;
};
Element.add({name: "PROCENDTM", required: true, order: 10, owner: TransferProfile, /*type: String,*/ readMethod: "getProcessEndTime", writeMethod: "setProcessEndTime"});


/**
 * Sets the time of day that day's processing ends.
 *
 * Time formatted as "HHMMSS.XXX[gmt offset[:tz name]]",
 * the milliseconds and time zone are still optional, and default to GMT.

 * @see "Section 3.2.8.3 OFX Spec"
 * @param {String} processEndTime formatted as "HHMMSS.XXX[gmt offset[:tz name]]"
 */
TransferProfile.prototype.setProcessEndTime = function(processEndTime) {
  this.processEndTime = processEndTime;
};


TransferProfile.prototype.getSupportsScheduledTransfers = function() {
  return this.supportsScheduledTransfers;
};
Element.add({name: "CANSCHED", required: true, order: 20, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsScheduledTransfers", writeMethod: "setSupportsScheduledTransfers"});


TransferProfile.prototype.setSupportsScheduledTransfers = function(/*Boolean*/ supportsScheduledTransfers) {
  this.supportsScheduledTransfers = supportsScheduledTransfers;
};


/**
 * Requires <CANSCHED>
 * @return {Boolean} Boolean whether supports recurring transfers
 */
TransferProfile.prototype.getSupportsRecurringTransfers = function() {
  return this.supportsRecurringTransfers;
};
Element.add({name: "CANRECUR", required: true, order: 30, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsRecurringTransfers", writeMethod: "setSupportsRecurringTransfers"});


TransferProfile.prototype.setSupportsRecurringTransfers = function(/*Boolean*/ supportsRecurringTransfers) {
  this.supportsRecurringTransfers = supportsRecurringTransfers;
};


/**
 * <CANLOAN>Y must be present for transfers to involve loans
 * @return {Boolean} Boolean whether supports loan transfers
 */
TransferProfile.prototype.getSupportsLoanTransfers = function() {
  return this.supportsLoanTransfers;
};
Element.add({name: "CANLOAN", order: 40, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsLoanTransfers", writeMethod: "setSupportsLoanTransfers"});


TransferProfile.prototype.setSupportsLoanTransfers = function(/*Boolean*/ supportsLoanTransfers) {
  this.supportsLoanTransfers = supportsLoanTransfers;
};


TransferProfile.prototype.getSupportsScheduledLoanTransfers = function() {
  return this.supportsScheduledLoanTransfers;
};
Element.add({name: "CANSCHEDLOAN", order: 50, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsScheduledLoanTransfers", writeMethod: "setSupportsScheduledLoanTransfers"});


TransferProfile.prototype.setSupportsScheduledLoanTransfers = function(/*Boolean*/ supportsScheduledLoanTransfers) {
  this.supportsScheduledLoanTransfers = supportsScheduledLoanTransfers;
};


TransferProfile.prototype.getSupportsRecurringLoanTransfers = function() {
  return this.supportsRecurringLoanTransfers;
};
Element.add({name: "CANRECURLOAN", order: 60, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsRecurringLoanTransfers", writeMethod: "setSupportsRecurringLoanTransfers"});


TransferProfile.prototype.setSupportsRecurringLoanTransfers = function(/*Boolean*/ supportsRecurringLoanTransfers) {
  this.supportsRecurringLoanTransfers = supportsRecurringLoanTransfers;
};


TransferProfile.prototype.getSupportsTransferModification = function() {
  return this.supportsTransferModification;
};
Element.add({name: "CANMODXFERS", required: true, order: 70, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsTransferModification", writeMethod: "setSupportsTransferModification"});


TransferProfile.prototype.setSupportsTransferModification = function(/*Boolean*/ supportsTransferModification) {
  this.supportsTransferModification = supportsTransferModification;
};


TransferProfile.prototype.getSupportsModelModification = function() {
  return this.supportsModelModification;
};
Element.add({name: "CANMODMDLS", required: true, order: 80, owner: TransferProfile, /*type: Boolean,*/ readMethod: "getSupportsModelModification", writeMethod: "setSupportsModelModification"});


TransferProfile.prototype.setSupportsModelModification = function(/*Boolean*/ supportsModelModification) {
  this.supportsModelModification = supportsModelModification;
};


/**
 * Model window
 * the number of days before a recurring transaction is scheduled to be processed that it is
 * instantiated on the system
 * @return {Integer} Integer number of days before a recurring transaction is scheduled to be processed that it is instantiated on the system
 */
TransferProfile.prototype.getModelWindow = function() {
  return this.modelWindow;
};
Element.add({name: "MODELWND", required: true, order: 90, owner: TransferProfile, /*type: Integer,*/ readMethod: "getModelWindow", writeMethod: "setModelWindow"});


TransferProfile.prototype.setModelWindow = function(/*Integer*/ modelWindow) {
  this.modelWindow = modelWindow;
};


/**
 * Number of days before processing date that funds are withdrawn
 * @return {Integer} Integer number of days before processing date that funds are withdrawn
 */
TransferProfile.prototype.getWithdrawnDays = function() {
  return this.withdrawnDays;
};
Element.add({name: "DAYSWITH", required: true, order: 100, owner: TransferProfile, /*type: Integer,*/ readMethod: "getWithdrawnDays", writeMethod: "setWithdrawnDays"});


TransferProfile.prototype.setWithdrawnDays = function(/*Integer*/ withdrawnDays) {
  this.withdrawnDays = withdrawnDays;
};


/**
 * Default number of days to pay
 * @return {Integer} Integer Default number of days to pay
 */
TransferProfile.prototype.getDefaultDaysToPay = function() {
  return this.defaultDaysToPay;
};
Element.add({name: "DFLTDAYSTOPAY", required: true, order: 110, owner: TransferProfile, /*type: Integer,*/ readMethod: "getDefaultDaysToPay", writeMethod: "setDefaultDaysToPay"});


TransferProfile.prototype.setDefaultDaysToPay = function(/*Integer*/ defaultDaysToPay) {
  this.defaultDaysToPay = defaultDaysToPay;
};




module.exports = TransferProfile;
