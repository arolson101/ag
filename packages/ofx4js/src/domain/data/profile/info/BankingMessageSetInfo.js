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

var AbstractMessageSetInfo = require("../../profile/AbstractMessageSetInfo");
var Aggregate = require("../../../../meta/Aggregate");
var ChildAggregate = require("../../../../meta/ChildAggregate");
var BankingV1MessageSetInfo = require("./BankingV1MessageSetInfo");

/**
 * @class
 * @augments AbstractMessageSetInfo
 */
function BankingMessageSetInfo () {

  /**
   * @name BankingMessageSetInfo#version1Info
   * @type BankingV1MessageSetInfo
   * @access private
   */
  this.version1Info = null;
}

inherit(BankingMessageSetInfo, "extends", AbstractMessageSetInfo);


Aggregate.add("BANKMSGSET", BankingMessageSetInfo);


BankingMessageSetInfo.prototype.getVersion1Info = function() {
  return this.version1Info;
};
ChildAggregate.add(BankingMessageSetInfo, {order: 0, attributeType: BankingV1MessageSetInfo, readMethod: "getVersion1Info", writeMethod: "setVersion1Info"});


BankingMessageSetInfo.prototype.setVersion1Info = function(/*BankingV1MessageSetInfo*/ version1Info) {
  this.version1Info = version1Info;
};




module.exports = BankingMessageSetInfo;