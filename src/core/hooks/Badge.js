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
  static predefinedColors = new Set(['primary', 'success', 'info', 'danger', 'warning']);

  toHtml(whole, m1, m2, m3) {
    // 处理颜色
    let clazz = 'badge  ';
    let style = '';
    if (Badge.predefinedColors.has(m2)) {
      clazz += `badge-${m2} `;
    } else if (/^#\w{6}$/.test(m2)) {
      style += `background-color: ${m2}`;
    } else {
      clazz += 'badge-primary ';
    }

    // 处理位置
    const position = ['top', 'bottom'].includes(m3) ? m3 : 'center';
    const positionClass = `badge-${position}`;
    clazz += positionClass;
    return `<span style="${style}" class="${clazz}">${m1}</span>`;
  }

  makeHtml(str) {
    if (!this.test(str)) {
      return str;
    }

    return str.replace(this.RULE.reg, this.toHtml);
  }

  rule() {
    // 正则表达式匹配 {badge:文本|颜色|位置}
    return {
      begin: '',
      content: '',
      end: '',
      reg: new RegExp('\\{badge:([^|}]+)\\|?([^|}]*)\\|?([^}]*)\\}', 'g'),
    };
  }
}
