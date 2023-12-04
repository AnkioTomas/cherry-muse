/**
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import SyntaxBase from '../SyntaxBase';
import { isLookbehindSupported } from '../../utils/regexp';
import { replaceLookbehind } from '../../utils/lookbehind-replace';

export default class Mark extends SyntaxBase {
  static HOOK_NAME = 'mark';

  toHtml(whole, m1, m2) {
    return `<mark>${m1}</mark>`;
  }

  makeHtml(str) {
    if (!this.test(str)) {
      return str;
    }

    if (isLookbehindSupported()) {
      return str.replace(this.RULE.reg, this.toHtml);
    }
    return replaceLookbehind(str, this.RULE.reg, this.toHtml, true, 1);
  }

  rule() {
    const ret = {
      begin: '==',
      end: '==',
      content: '(.+?)', // 匹配任意文本
    };
    ret.reg = new RegExp('==(.*?)==', 'g');
    return ret;
  }
}
