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

/**
 * Type of investment transaction.
 * See "Section 13.9.2.4.4, OFX Spec"
 *
 * @enum
 */
var TransactionType = {

  BUY_DEBT: "BUY_DEBT",
  BUY_MUTUAL_FUND: "BUY_MUTUAL_FUND",
  BUY_OPTION: "BUY_OPTION",
  BUY_OTHER: "BUY_OTHER",
  BUY_STOCK: "BUY_STOCK",
  CLOSE_OPTION: "CLOSE_OPTION",
  INCOME: "INCOME",
  INVESTMENT_EXPENSE: "INVESTMENT_EXPENSE",
  JOURNAL_FUND: "JOURNAL_FUND",
  JOURNAL_SECURITY: "JOURNAL_SECURITY",
  MARGIN_INTEREST: "MARGIN_INTEREST",
  REINVEST_INCOME: "REINVEST_INCOME",
  RETURN_OF_CAPITAL: "RETURN_OF_CAPITAL",
  SELL_DEBT: "SELL_DEBT",
  SELL_MUTUAL_FUND: "SELL_MUTUAL_FUND",
  SELL_OPTION: "SELL_OPTION",
  SELL_OTHER: "SELL_OTHER",
  SELL_STOCK: "SELL_STOCK",
  SPLIT: "SPLIT",
  TRANSFER: "TRANSFER",
};


module.exports = TransactionType;
