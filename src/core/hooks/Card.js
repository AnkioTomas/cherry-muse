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
import { prependLineFeedForParagraph } from '@/utils/lineFeed';
import { getPanelRule } from '@/utils/regexp';

/**
 * 面板语法
 * 例：
 *  :::card
 * [标题](链接) ![描述](图片链接)
 * :::
 *  :::card
 * [标题](链接)
 * :::
 * :::cardImage 3
 * [标题](链接) ![描述](图片链接)
 * :::
 */
export default class Card extends ParagraphBase {
  static HOOK_NAME = 'card';

  constructor(options) {
    super({ needCache: true });
    this.initBrReg(options.globalConfig.classicBr);
  }

  makeHtml(str, sentenceMakeFunc) {
    if (!str.match(this.RULE.reg)) return str;
    return str.replace(this.RULE.reg, (match, preLines, name, content) => {
      const lineCount = this.getLineCount(match, preLines);
      const sign = this.$engine.md5(match);
      const lines = match.trim().split('\n');
      if (lines.length < 2) return str;

      const cardRule = /^:::(\s*)?(card|cardImage)(\s\d+)?/;
      const cardResult = lines[0].match(cardRule);
      if (!cardResult) return str;
      let [, , type, count] = cardResult;
      if (type === 'card') {
        type = 'list';
      } else if (type === 'cardImage') {
        type = 'image';
      }

      if (!count) {
        count = 'auto';
      } else {
        count = parseInt(count, 10);
      }

      const rule = /^\[(.*?)]\((.*?)\)((\s+)?!\[(.*?)]\((.*?)\))?$/;
      const rows = [];
      for (let i = 1; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        const result = rule.exec(line);
        if (result) {
          const [, title, link, , , desc, image] = result;
          rows.push({
            title,
            link,
            desc,
            image,
          });
        }
      }
      if (rows.length === 0) return str;
      const ret = this.pushCache(this.render(rows, type, count, sign, lineCount), sign, lineCount);
      return prependLineFeedForParagraph(match, ret);
    });
  }

  render(data, _type, count, sign, lineCount) {
    const json = {
      type: _type,
      data,
      count,
    };

    let row = json.count;
    if (row === 'auto') {
      row = 3;
      if (json.data.length < row) {
        row = json.data.length;
      }
    }
    if (!row || row > 4 || row < 1) {
      row = 3; // 默认 3
    }

    const { type } = json;
    let listDOM = ``;
    if (type === 'list') {
      // 普通卡片列表
      listDOM = this.getListDOM(json.data, row);
    } else if (type === 'image') {
      // 卡片图片列表
      listDOM = this.getImageDOM(json.data, row);
    }
    return `<div class="cherry-card cherry-card-${type}-container" data-sign="${sign}" data-lines="${lineCount}">${listDOM}</div>`;
  }

  getRandomColor() {
    const colors = [
      { bg: '#34495E', text: '#BDC3C7' }, // 深蓝灰色背景，浅灰色文字
      { bg: '#16A085', text: '#A3E4D7' }, // 绿松石色背景，浅绿松石色文字
      { bg: '#27AE60', text: '#A9DFBF' }, // 绿色背景，浅绿色文字
      { bg: '#2980B9', text: '#AED6F1' }, // 蓝色背景，浅蓝色文字
      { bg: '#8E44AD', text: '#D2B4DE' }, // 紫色背景，浅紫色文字
      { bg: '#2C3E50', text: '#ECF0F1' }, // 深蓝灰色背景，浅灰色文字
      { bg: '#F39C12', text: '#FDEBD0' }, // 橙黄色背景，浅橙色文字
      { bg: '#D35400', text: '#F5CBA7' }, // 深橙色背景，浅橙色文字
      { bg: '#C0392B', text: '#F5B7B1' }, // 深红色背景，浅红色文字
      { bg: '#7F8C8D', text: '#D5DBDB' }, // 灰青色背景，浅灰色文字
      { bg: '#95A5A6', text: '#E5E8E8' }, // 浅青色背景，浅灰色文字
      { bg: '#F4D03F', text: '#FCF3CF' }, // 明黄色背景，浅黄色文字
      { bg: '#1ABC9C', text: '#A2D9CE' }, // 浅绿松石色背景，浅绿松石色文字
      { bg: '#3498DB', text: '#D6EAF8' }, // 浅蓝色背景，浅蓝色文字
      { bg: '#9B59B6', text: '#E8DAEF' }, // 浅紫色背景，浅紫色文字
      { bg: '#34495E', text: '#AAB7B8' }, // 蓝灰色背景，浅灰色文字
      { bg: '#E67E22', text: '#FAD7A0' }, // 橙色背景，浅橙色文字
      { bg: '#E74C3C', text: '#F5B7B1' }, // 红色背景，浅红色文字
      { bg: '#BDC3C7', text: '#2C3E50' }, // 浅灰色背景，深蓝灰色文字
      { bg: '#7F8C8D', text: '#2C3E50' }, // 灰青色背景，深蓝灰色文字
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  getListDOM(dataList, row) {
    let listDOM = '';
    dataList.forEach((item) => {
      const randomColor = this.getRandomColor();
      let {
        link = '',
        image = '',
        bgColor = randomColor.bg,
        textColor = randomColor.text,
        title = '',
        desc = '',
      } = item;

      if (link === '') {
        link = null;
      }
      if (image === '') {
        image = null;
      }
      if (title === '') {
        title = '';
      }
      if (desc === '') {
        desc = '';
      }
      if (bgColor === '') {
        bgColor = randomColor.bg;
      }
      if (textColor === '') {
        textColor = randomColor.text;
      }

      listDOM += `
      <${link ? `a href="${link}" target="_blank"` : 'span'} class="cherry-card-item ${
        row ? `cherry-card-row-${row}` : ''
      }"
         style="padding:0;background-color:${bgColor};color:${textColor};"
      >
        ${image ? `<img src="${image}" class="cherry-card-image" alt="">` : ''}
        <div class="cherry-card-body">
          <p class="cherry-card-title">${title}</p>
          <p class="cherry-card-desc">${desc}</p>
        </div>
      </${link ? 'a' : 'span'}>
    `;
    });
    return listDOM;
  }

  getImageDOM(dataList, row) {
    let listDOM = '';
    dataList.forEach((item) => {
      let { link = '', img = '', title = '', desc = '' } = item;

      if (link === '') {
        link = null;
      }
      if (img === '') {
        img = '';
      }
      if (title === '') {
        title = '';
      }
      if (desc === '') {
        desc = null;
      }

      listDOM += `
      <div class="cherry-card-item ${row ? `cherry-card-row-${row}` : ''}" >
        <a href="${link}" target="_blank">
          <div class="cherry-card-box-img">
              <img src="${img}" class="cherry-card-image" style="object-fit: cover" alt="">
          </div>
          <div class="cherry-card-box-info">
              <p class="cherry-card-title">${title}</p>
              ${desc ? `<p class="cherry-card-desc" >${desc}</p>` : ''}
          </div>

    
        </a>
      </div>
    `;
    });
    return listDOM;
  }

  rule() {
    return getPanelRule();
  }

  overlayMode() {
    return {
      inContainer: false,
      inType: false,
      name: 'card',
      token(stream, state) {
        // 检查行的开头是否有 ':::'
        if (stream.sol() && stream.match(':::')) {
          this.inContainer = stream.peek() !== null;
          this.inType = false;
          return 'panel-container';
        }

        const rule = /\s(card|cardImage)/;

        // 尝试匹配规则
        if (this.inContainer && stream.match(rule)) {
          this.inContainer = false;
          this.inType = true;
          return 'panel-type';
        }
        if (this.inType && stream.match(/\s.*$/)) {
          this.inType = false;
          return 'panel-title';
        }
        this.inType = false;
        this.inContainer = false;
        stream.next(); // 前进到下一个字符
        return null; // 默认返回 null
      },
    };
  }
}
