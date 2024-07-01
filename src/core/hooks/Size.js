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
import SyntaxBase from '@/core/SyntaxBase';
import { isLookbehindSupported } from '@/utils/regexp';
import { replaceLookbehind } from '@/utils/lookbehind-replace';

export default class Size extends SyntaxBase {
  static HOOK_NAME = 'fontSize';

  // constructor() {
  //     super();
  // }

  toHtml(whole, m1, m2, m3) {
    return `${m1}<span style="font-size:${m2}px;line-height:1em;">${m3}</span>`;
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
      begin: isLookbehindSupported() ? '((?<!\\\\))!' : '(^|[^\\\\])!',
      end: '!',
      content: '([0-9]{1,2})[\\s]([\\w\\W]*?)',
    };
    ret.reg = new RegExp(ret.begin + ret.content + ret.end, 'g');
    return ret;
  }

  overlayMode() {
    return {
      name: 'size',
      inSizeContainer: false,
      countTotal: 0,
      token(stream, state) {
        // 尝试匹配规则
        if (stream.match(/!\d+\s.*?!/)) {
          stream.backUp(stream.current().length); // 回退以单独处理
          this.inSizeContainer = true;
          this.countTotal = 0;
        }

        if (this.inSizeContainer && stream.match('!')) {
          this.countTotal += 1;
          if (this.countTotal === 2) {
            this.inSizeContainer = false;
            this.countTotal = 0;
          }
          return 'size-container'; // 自定义样式类名
        }

        if (this.inSizeContainer && stream.match(/\d+/)) {
          return 'size-number'; // 自定义样式类名
        }

        stream.next(); // 前进到下一个字符
        return null; // 默认返回 null
      },
    };
  }
}
