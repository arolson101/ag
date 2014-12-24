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
 * The type of mutual fund.
 * @see "Section 13.8.5.2, OFX Spec"
 *
 * @author Jon Perlow
 */
var MutualFundType = {
  OPEN_END: 0,
  CLOSE_END: 1,
  OTHER: 2,

  fromOfx: function(/*String*/ ofxVal) {
    if ("OPENEND".equals(ofxVal)) {
      return MutualFundType.OPEN_END;
    } else if ("CLOSEEND".equals(ofxVal)) {
      return MutualFundType.CLOSE_END;
    } else if ("OTHER".equals(ofxVal)) {
      return MutualFundType.OTHER;
    } else {
      return null;
    }
  }
};


module.exports = MutualFundType;
