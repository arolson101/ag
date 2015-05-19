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
///<reference path='../../../meta/Aggregate_add'/>
///<reference path='../../../meta/ChildAggregate_add'/>
///<reference path='../MessageSetType'/>
///<reference path='../RequestMessageSet'/>
///<reference path='BankStatementRequestTransaction'/>

module ofx4js.domain.data.banking {

import MessageSetType = ofx4js.domain.data.MessageSetType;
import RequestMessageSet = ofx4js.domain.data.RequestMessageSet;
import RequestMessage = ofx4js.domain.data.RequestMessage;
import Aggregate_add = ofx4js.meta.Aggregate_add;
import ChildAggregate_add = ofx4js.meta.ChildAggregate_add;

/**
 * @author Ryan Heaton
 */
export class BankingRequestMessageSet extends RequestMessageSet {

  private statementRequest: BankStatementRequestTransaction;

  public getType(): MessageSetType {
    return MessageSetType.banking;
  }

  /**
   * The statement request.
   *
   * @return The statement request.
   */
  public getStatementRequest(): BankStatementRequestTransaction {
    return this.statementRequest;
  }

  /**
   * The statement request.
   *
   * @param statementRequest The statement request.
   */
  public setStatementRequest(statementRequest: BankStatementRequestTransaction): void {
    this.statementRequest = statementRequest;
  }

  // Inherited.
  public getRequestMessages(): Array<RequestMessage> {
    var requestMessages: Array<RequestMessage> = [];
    if (this.getStatementRequest() != null) {
      requestMessages.push(this.getStatementRequest());
    }
    return requestMessages;
  }
}

Aggregate_add( BankingRequestMessageSet, "BANKMSGSRQV1" );
ChildAggregate_add(BankingRequestMessageSet, { order: 0, type: BankStatementRequestTransaction, read: BankingRequestMessageSet.prototype.getStatementRequest, write: BankingRequestMessageSet.prototype.setStatementRequest });

}
