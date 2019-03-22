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

module ofx4js.domain.data.investment.positions {

/**
 * Type of position.
 * @see "Section 13.9.2.4.4, OFX Spec"
 *
 * @author Jon Perlow
 */
export enum PositionType {
  LONG,
  SHORT
}

export function PositionType_fromOfx(ofxVal: string): PositionType {
  if ("LONG" === ofxVal) {
    return PositionType.LONG;
  } else if ("SHORT" === ofxVal) {
    return PositionType.SHORT;
  } else {
    return null;
  }
}

}
