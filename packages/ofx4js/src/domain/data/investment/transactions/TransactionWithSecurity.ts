/*
 * Copyright 2010 Web Cohesion
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
import {SecurityId} from "../../seclist/SecurityId";

/**
 * Interface for transactions that have a security associated with them.
 *
 * @author Jon Perlow
 */
export interface TransactionWithSecurity {

  /**
   * Gets the security for the transaction.
   *
   * @return the security id for the transaction
   */
  getSecurityId(): SecurityId;
}


