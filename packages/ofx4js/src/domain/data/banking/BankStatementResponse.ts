/*
 * Copyright 2008 Web Cohesion
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
import {StatementResponse} from "../common/StatementResponse";
import {Aggregate_add} from "../../../meta/Aggregate_Add";
import {ChildAggregate_add} from "../../../meta/ChildAggregate_add";
import {BankAccountDetails} from "BankAccountDetails";

/**
 * @author Ryan Heaton
 */
export class BankStatementResponse extends StatementResponse {

  private account: BankAccountDetails;

  public getResponseMessageName(): string {
    return "bank statement";
  }

  /**
   * The account for the statement.
   *
   * @return The account for the statement.
   */
  public getAccount(): BankAccountDetails {
    return this.account;
  }

  /**
   * The account for the statement.
   *
   * @param account The account for the statement.
   */
  public setAccount(account: BankAccountDetails): void {
    this.account = account;
  }

}

Aggregate_add( BankStatementResponse, "STMTRS" );
ChildAggregate_add(BankStatementResponse, { name:"BANKACCTFROM", order: 10, type: BankAccountDetails, read: BankStatementResponse.prototype.getAccount, write: BankStatementResponse.prototype.setAccount });


