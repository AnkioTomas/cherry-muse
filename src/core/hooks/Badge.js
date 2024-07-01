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
export default class Badge extends SyntaxBase {
  static HOOK_NAME = 'badge';

  // 预定义颜色类
  static predefinedColors = new Set(['important', 'info', 'note', 'tip', 'warning', 'danger']);

  toHtml(whole, m1, m2, m3) {
    // 处理颜色
    let clazz = 'cherry-badge ';
    let style = '';
    let m4 = m3;
    // 检查是否是预定义颜色
    if (m2 && Badge.predefinedColors.has(m2)) {
      clazz += `cherry-badge-${m2} `;
    } else if (m2 && /^#\w{6}$/.test(m2)) {
      // 检查是否是自定义颜色
      style += `background-color: ${m2}`;
    } else if (m2) {
      // 处理位置作为第二个参数的情况
      clazz += 'cherry-badge-info ';
      m4 = m2;
    } else {
      clazz += 'cherry-badge-info ';
    }

    // 处理位置
    const position = ['top', 'bottom', 'center'].includes(m4) ? m4 : 'center';
    const positionClass = `cherry-badge-${position}`;
    clazz += positionClass;

    return `<span style="${style}" class="${clazz}">${m1}</span>`;
  }

  makeHtml(str) {
    if (!this.test(str)) {
      return str;
    }

    return str.replace(this.RULE.reg, this.toHtml.bind(this));
  }

  rule() {
    // 正则表达式匹配 [[文本]], [[文本:颜色或位置]], [[文本:颜色,位置]]
    return {
      begin: '',
      content: '',
      end: '',
      reg: new RegExp('\\[\\[([^:\\]]+):?([^,\\]]*)?,?([^\\]]*)\\]\\]', 'g'),
    };
  }
  overlayMode() {
    return {
      name: 'badge',
      inBadge: false,
      token(stream, state) {
        // 检查行的开头是否有 ':::'
        if (stream.match(/\[\[(.*)]]/)) {
          this.inBadge = true;
          stream.backUp(stream.current().length); // 回退以单独处理
        }
        if (this.inBadge) {
          if (stream.match('[[')) {
            return 'badge-container';
          }
          if (stream.match(':') || stream.match(',')) {
            return 'badge-color';
          }

          if (stream.match(/important|info|note|tip|warning|danger|top|bottom|center/) || stream.match(/#[\w+]{6}/)) {
            return 'badge-text';
          }
          if (stream.match(']]')) {
            this.inBadge = false;
            return 'badge-container';
          }
        }

        stream.next(); // 前进到下一个字符
        return null; // 默认返回 null
      },
    };
  }
}
