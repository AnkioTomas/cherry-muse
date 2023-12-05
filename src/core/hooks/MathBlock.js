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
import ParagraphBase from '@/core/ParagraphBase';
import { getHTML } from '@/utils/dom';
import { isLookbehindSupported } from '@/utils/regexp';
import { replaceLookbehind } from '@/utils/lookbehind-replace';
import { Theme } from '@/Theme';
import Event from '../../Event';
export default class MathBlock extends ParagraphBase {
  static HOOK_NAME = 'mathBlock';

  constructor({ config }) {
    super({ needCache: true });
    // 非浏览器环境下配置为 node
    const { MathJax, apiHost = 'https://math.vercel.app' } = config;
    this.api = !MathJax && !window.MathJax;
    this.apiHost = apiHost;
    this.MathJax = MathJax || window.MathJax;
    if (this.api) {
      const that = this;
      Event.on('Theme', 'change', function (isDark) {
        const images = that.$engine.$cherry.wrapperDom.querySelectorAll('.Cherry-Math-Latex');
        images.forEach(function (item, index) {
          item.src = item.src.replace(isDark ? 'color=black' : 'color=white', isDark ? 'color=white' : 'color=black');
        });
      });
    }
  }

  toHtml(wholeMatch, lineSpace, leadingChar, content) {
    // 去掉开头的空字符，去掉结尾的换行符
    const wholeMatchWithoutSpace = wholeMatch.replace(/^[ \f\r\t\v]*/, '').replace(/\s*$/, '');
    // 去掉匹配到的第一个换行符
    const lineSpaceWithoutPreSpace = lineSpace.replace(/^[ \f\r\t\v]*\n/, '');
    const sign = this.$engine.md5(wholeMatch);
    let lines = this.getLineCount(wholeMatchWithoutSpace, lineSpaceWithoutPreSpace);
    // 判断公式是不是新行输入，如果不是新行，则行号减1
    if (!/\n/.test(lineSpace)) {
      lines -= 1;
    }
    // 判断公式后面有没有尾接内容，如果尾接了内容，则行号减1
    if (!/\n\s*$/.test(wholeMatch)) {
      lines -= 1;
    }
    // 目前的机制还没有测过lines为负数的情况，先不处理
    lines = lines > 0 ? lines : 0;

    if (this.MathJax?.tex2svg) {
      // MathJax渲染
      const svg = getHTML(this.MathJax.tex2svg(content), true);
      const result = `<div data-sign="${sign}" class="Cherry-Math" data-type="mathBlock"
            data-lines="${lines}">${svg}</div>`;
      return leadingChar + this.getCacheWithSpace(this.pushCache(result, sign, lines), wholeMatch);
    }
    const result = `<div data-sign="${sign}" class="Cherry-Math" data-type="mathBlock"
            data-lines="${lines}"><img class="Cherry-Math-Latex" alt="latex" src="${
      this.apiHost
    }/?from=${encodeURIComponent(content)}&color=${Theme.isDark() ? 'white' : 'black'}" /></div>`;
    return leadingChar + this.getCacheWithSpace(this.pushCache(result, sign, lines), wholeMatch);
  }

  beforeMakeHtml(str) {
    if (isLookbehindSupported()) {
      return str.replace(this.RULE.reg, this.toHtml.bind(this));
    }
    return replaceLookbehind(str, this.RULE.reg, this.toHtml.bind(this), true, 1);
  }

  makeHtml(str) {
    return str;
  }

  rule() {
    const ret = {
      begin: isLookbehindSupported() ? '(\\s*)((?<!\\\\))~D~D\\s*' : '(\\s*)(^|[^\\\\])~D~D\\s*',
      content: '([\\w\\W]*?)',
      end: '(\\s*)~D~D(?:\\s{0,1})',
    };
    ret.reg = new RegExp(ret.begin + ret.content + ret.end, 'g');
    return ret;
  }
}
