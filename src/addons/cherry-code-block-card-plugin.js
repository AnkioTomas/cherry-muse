// @ts-nocheck
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
import mergeWith from 'lodash/mergeWith';
import extraJSON from '../utils/jsonUtils';
export default class CardCodeEngine {
  static install(cherryOptions, args) {
    mergeWith(cherryOptions, {
      engine: {
        syntax: {
          codeBlock: {
            customRenderer: {
              card: new CardCodeEngine(),
            },
          },
        },
      },
    });
  }

  render(src, sign, $engine, config = {}) {
    let $sign = sign;
    if (!$sign) {
      $sign = Math.round(Math.random() * 100000000);
    }
    const json = extraJSON(src);
    let row = json.count;
    if (!row || row > 4 || row < 1) {
      row = 3; // 默认 3
    }
    const { type } = json;
    let listDOM = ``;
    if (type === 'card') {
      // 普通卡片列表
      listDOM = this.getCardListDOM(json.data, row);
    } else if (type === 'cardImage') {
      // 卡片图片列表
      listDOM = this.getCardImgListDOM(json.data, row);
    }
    return `<div class="${
      type === 'card' ? 'cardList' : 'cardImgList'
    }Container"><div class="card-list">${listDOM}</div>`;
  }
  getCardListDOM(dataList, row) {
    let listDOM = '';
    dataList.forEach((item) => {
      const {
        link = null,
        avatar = '',
        target = '_blank',
        bgColor = null,
        textColor = null,
        name = '',
        desc = '',
      } = item;
      listDOM += `
      <${link ? `a href="${link}" target="${target}"` : 'span'} class="card-item ${row ? `row-${row}` : ''}"
         style="padding:0;${
           bgColor ? `background-color:${bgColor};--randomColor:${bgColor};` : '--randomColor: var(--bodyBg);'
         }${textColor ? `color:${textColor};` : ''}"
      >
        ${avatar ? `<img src="${avatar}" class="no-zoom" alt="">` : ''}
        <div>
          <p class="name">${name}</p>
          <p class="desc">${desc}</p>
        </div>
      </${link ? 'a' : 'span'}>
    `;
    });
    return listDOM;
  }

  getCardImgListDOM(dataList, row) {
    let listDOM = '';
    dataList.forEach((item) => {
      const {
        link = null,
        imgHeight = 'auto',
        target = '_blank',
        img = '',
        objectFit = 'cover',
        avatar = null,
        author = null,
        name = '',
        lineClamp = 1,
        desc = null,
      } = item;
      listDOM += `
      <div class="card-item ${row ? `row-${row}` : ''}" >
        <a href="${link}" target="${target}">
          <div class="box-img" style="height: ${imgHeight}">
              <img src="${img}" class="no-zoom" style="object-fit: ${objectFit}" alt="">
          </div>
          <div class="box-info">
              <p class="name">${name}</p>
              ${desc ? `<p class="desc" style="-webkit-line-clamp: ${lineClamp}">${desc}</p>` : ''}
          </div>

          ${
            avatar || author
              ? `<div class="box-footer">
              ${avatar ? `<img src="${avatar}" class="no-zoom">` : ''}
              ${author ? `<span>${author}</span>` : ''}
          </div>`
              : ''
          }
        </a>
      </div>
    `;
    });
    return listDOM;
  }
}
