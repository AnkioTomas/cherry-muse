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
import { compileRegExp } from '@/utils/regexp';

function computeLeadingSpaces(leadingChars) {
  const indentRegex = /^(\t|[ ]{1,4})/;
  let leadingCharsTemp = leadingChars;
  let indent = 0;
  while (indentRegex.test(leadingCharsTemp)) {
    leadingCharsTemp = leadingCharsTemp.replace(/^(\t|[ ]{1,4})/g, '');
    indent += 1;
  }
  return indent;
}

export default class Blockquote extends ParagraphBase {
  static HOOK_NAME = 'blockquote';

  constructor() {
    super({ needCache: true });
    // TODO: String.prototype.repeat polyfill
  }

  getAlertInfo(line) {
    const match = line.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (match) {
      return {
        type: match[1].toUpperCase(),
        remaining: line.replace(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i, ''),
      };
    }
    return null;
  }

  getPanelClass(type) {
    const map = {
      NOTE: 'note',
      TIP: 'tip',
      IMPORTANT: 'important',
      WARNING: 'warning',
      CAUTION: 'danger',
    };
    const t = map[type] || 'note';
    return `cherry-panel cherry-panel__${t}`;
  }

  getPanelTitle(type) {
    const map = {
      NOTE: 'Note',
      TIP: 'Tip',
      IMPORTANT: 'Important',
      WARNING: 'Warning',
      CAUTION: 'Caution',
    };
    return map[type] || type;
  }

  handleMatch(str, sentenceMakeFunc) {
    return str.replace(this.RULE.reg, (match, lines, content) => {
      const { sign: contentSign, html: parsedHtml } = sentenceMakeFunc(content);
      const sign = this.signWithCache(parsedHtml) || contentSign;
      const lineCount = this.getLineCount(match, lines); // 段落所占行数
      const listRegex =
        /^(([ \t]{0,3}([*+-]|\d+[.]|[a-z]\.|[I一二三四五六七八九十]+\.)[ \t]+)([^\r]+?)($|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.]|[a-z]\.|[I一二三四五六七八九十]+\.)[ \t]+)))/;
      let lastIndent = computeLeadingSpaces(lines);
      // 逐行处理
      const contentLines = parsedHtml.split('\n');
      const replaceReg = /^[>\s]+/;
      const countReg = />/g;
      let lastLevel = 0;
      let handledHtml = '';
      const tagStack = [];
      const rootAttrs = ` data-sign="${sign}_${lineCount}" data-lines="${lineCount}"`;
      let isRoot = true;
      let skipNextBr = false;

      for (let i = 0; contentLines[i]; i++) {
        if (i !== 0) {
          const leadIndent = computeLeadingSpaces(contentLines[i]);
          if (leadIndent <= lastIndent && listRegex.test(contentLines[i])) {
            break;
          }
          lastIndent = leadIndent;
        }
        /* eslint-disable no-loop-func */
        let currentLevel = 0;
        let $line = contentLines[i].replace(replaceReg, (leadSymbol) => {
          const leadSymbols = leadSymbol.match(countReg);
          // 本行引用嵌套层级比上层要多
          if (leadSymbols && leadSymbols.length > lastLevel) {
            currentLevel = leadSymbols.length;
          } else {
            // 否则保持当前缩进层级
            currentLevel = lastLevel;
          }
          return '';
        });

        // 同层级，且不为首行时补充一个换行
        if (lastLevel === currentLevel && i !== 0) {
          if (!skipNextBr) {
            handledHtml += '<br>';
          }
          skipNextBr = false;
        }

        // 补充缩进
        if (lastLevel < currentLevel) {
          for (let l = lastLevel + 1; l <= currentLevel; l++) {
            let tagOpen = `<blockquote${isRoot ? rootAttrs : ''}>`;
            let tagClose = '</blockquote>';

            // Check for Alert
            if (l === currentLevel) {
              const alertInfo = this.getAlertInfo($line);
              if (alertInfo) {
                const className = this.getPanelClass(alertInfo.type);
                const title = this.getPanelTitle(alertInfo.type);
                tagOpen = `<div class="${className}"${
                  isRoot ? rootAttrs : ''
                }><div class="cherry-panel--title cherry-panel--title__not-empty">${title}</div><div class="cherry-panel--body"><p>`;
                tagClose = '</p></div></div>';
                $line = alertInfo.remaining;
                if ($line.trim() === '') {
                  skipNextBr = true;
                }
              }
            }

            handledHtml += tagOpen;
            tagStack.push(tagClose);
            isRoot = false;
          }
          lastLevel = currentLevel;
        }
        // 插入当前行内容
        handledHtml += $line;
      }
      // 标签闭合
      while (tagStack.length) {
        handledHtml += tagStack.pop();
      }
      return this.getCacheWithSpace(this.pushCache(handledHtml, sign, lineCount), match);
    });
  }

  makeHtml(str, sentenceMakeFunc) {
    if (!this.test(str)) {
      return str;
    }
    return this.handleMatch(str, sentenceMakeFunc);
  }

  rule() {
    const ret = {
      begin: '(?:^|\\n)(\\s*)',
      content: [
        '(',
        '>(?:.+?\\n(?![*+-]|\\d+[.]|[a-z]\\.))(?:>*.+?\\n(?![*+-]|\\d+[.]|[a-z]\\.))*(?:>*.+?)', // multiline
        '|', // or
        '>(?:.+?)', // single line
        ')',
      ].join(''),
      end: '(?=(\\n)|$)',
    };
    ret.reg = compileRegExp(ret, 'g');
    return ret;
  }
}
