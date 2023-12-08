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
import { escapeHTMLSpecialCharOnce as _e } from '@/utils/sanitize';
import { compileRegExp } from '@/utils/regexp';
import { gfmUnicode } from './Emoji.config';

// ref: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
export function convertToUnicode(code) {
  // 分割字符串为两部分
  const parts = code.split('-').map((part) => parseInt(part, 16));

  // 转换为 Unicode 字符
  return fromCodePoint(...parts);
}
export function fuzzySearchKeysWithValues(query, options) {
  const keys = Object.keys(gfmUnicode.emojis); // 获取所有键
  const queryLower = query; // 将查询转换为小写以实现大小写不敏感的搜索
  const combinedValues = [];
  for (const key of keys) {
    if (key.includes(queryLower)) {
      combinedValues.push({
        key: getEmoji(key, options),
        value: `:${key}:`,
      }); // 合并匹配键的值
    }
  }

  return combinedValues;
}

function getEmoji(key, options) {
  if (options.useUnicode) {
    return convertToUnicode(gfmUnicode.emojis[key]);
  }
  const src = options.resourceURL.replace(/\$\{code\}/g, gfmUnicode.emojis[key].toLowerCase());
  return `<img class="emoji" src="${src}" alt="${_e(key)}" />`;
}

function fromCodePoint(...args) {
  const codeUnits = [];
  let codeLen = 0;
  let result = '';
  for (let index = 0, len = args.length; index !== len; ++index) {
    let codePoint = +args[index];
    // correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
    // The surrounding `!(...)` is required to correctly handle `NaN` cases
    // The (codePoint>>>0) === codePoint clause handles decimals and negatives
    if (!(codePoint < 0x10ffff && codePoint >>> 0 === codePoint)) {
      throw new RangeError(`Invalid code point: ${codePoint}`);
    }
    if (codePoint <= 0xffff) {
      // BMP code point
      codeLen = codeUnits.push(codePoint);
    } else {
      // Astral code point; split in surrogate halves
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      codePoint -= 0x10000;
      codeLen = codeUnits.push(
        (codePoint >> 10) + 0xd800, // highSurrogate
        (codePoint % 0x400) + 0xdc00, // lowSurrogate
      );
    }
    if (codeLen >= 0x3fff) {
      result += String.fromCharCode.apply(null, codeUnits);
      codeUnits.length = 0;
    }
  }
  return result + String.fromCharCode.apply(null, codeUnits);
}

export default class Emoji extends SyntaxBase {
  static HOOK_NAME = 'emoji';

  constructor({ config } = { config: undefined }) {
    super({ config });
    this.options = {
      useUnicode: true,
      upperCase: false,
      customHandled: false,
      resourceURL: 'https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8',
      emojis: { ...gfmUnicode.emojis },
    };
    if (typeof config !== 'object') {
      return;
    }
    const { useUnicode, customResourceURL, customRenderer, upperCase } = config;
    this.options.useUnicode = typeof useUnicode === 'boolean' ? useUnicode : this.options.useUnicode;
    this.options.upperCase = typeof useUnicode === 'boolean' ? upperCase : this.options.upperCase;
    if (useUnicode === false && typeof customResourceURL === 'string') {
      this.options.resourceURL = customResourceURL;
    }
    if (typeof customRenderer === 'function') {
      this.options.customHandled = true;
      this.options.customRenderer = customRenderer;
    }
    // TODO: URL Validator
  }

  makeHtml(str, sentenceMakeFunc) {
    if (!this.test(str)) {
      return str;
    }
    return str.replace(this.RULE.reg, (match, emojiKey) => {
      // 先走自定义渲染逻辑
      if (this.options.customHandled && typeof this.options.customRenderer === 'function') {
        return this.options.customRenderer(emojiKey);
      }
      return getEmoji(emojiKey, this.options);
    });
  }

  rule() {
    // (?<protocol>\\w+:)\\/\\/
    const ret = {
      // ?<left>
      begin: ':',
      content: '([a-zA-Z0-9+_-]+?)',
      // ?<right>
      end: ':',
    };
    ret.reg = compileRegExp(ret, 'g');
    return ret;
  }
}
