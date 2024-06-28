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
import MenuBase from '@/toolbars/MenuBase';
import { getSelection } from '@/utils/selection';
import { gfmUnicode } from '@/core/hooks/Emoji.config';
import { getEmoji } from '@/core/hooks/Emoji';
/**
 * 插入Emoji的按钮
 */
export default class Emoji extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('emoji', 'mood');
    // this.bubbleMenu = true;
    this.bubbleEmoji = new BubbleEmoji($cherry);
  }
  $testIsEmoji(type, selection) {
    const textReg = /^:[\w-]+:$/;
    return textReg.test(selection);
  }

  /**
   * 响应点击事件
   * @param {string} selection 被用户选中的文本内容
   * @param {string} shortKey 快捷键参数，本函数不处理这个参数
   * @param {Event & {target:HTMLElement}} event 点击事件，用来从被点击的调色盘中获得对应的颜色
   * @returns 回填到编辑器光标位置/选中文本区域的内容
   */
  onClick(selection, shortKey = '', event) {
    if (this.hasCacheOnce()) {
      // @ts-ignore
      const { emoji } = this.getAndCleanCacheOnce();
      return `:${emoji}:`;
    }

    let top = 0;
    let left = 0;
    if (event.target.closest('.cherry-bubble')) {
      const $emojiDom = /** @type {HTMLElement}*/ (event.target.closest('.cherry-bubble'));
      const clientRect = $emojiDom.getBoundingClientRect();
      top = clientRect.top + $emojiDom.offsetHeight;
      left = /** @type {HTMLElement}*/ (event.target.closest('.cherry-toolbar-mood')).offsetLeft + clientRect.left;
    } else {
      const $emojiDom = /** @type {HTMLElement}*/ (event.target.closest('.cherry-toolbar-mood'));
      const clientRect = $emojiDom.getBoundingClientRect();
      top = clientRect.top + $emojiDom.offsetHeight;
      left = clientRect.left;
    }
    this.updateMarkdown = false;
    // 【TODO】需要增加getMoreSelection的逻辑
    this.bubbleEmoji.show({
      left,
      top,
      $emoji: this,
    });
  }
}

/**
 * 调色盘
 */
class BubbleEmoji {
  constructor($cherry) {
    this.editor = $cherry.editor;
    this.$cherry = $cherry;
    this.init();
    this.initAction();
  }

  /**
   * 用来暂存选中的内容
   * @param {string} selection 编辑区选中的文本内容
   */
  setSelection(selection) {
    this.selection = selection;
  }

  getEmojiDom() {
    let htmlHeader = `<div class="cherry-emoji-header">`;
    let htmlSearch = `<div class="cherry-emoji-search"><input type="text" placeholder="Search emoji" class="cherry-emoji-search-input"></div>`;
    let htmlBody = `<div class="cherry-emoji-body">`;
    const emojiStackDOM = Object.entries(this.categorizedEmojis)
      .map(([category, emojis]) => {

        let icon = "";
        switch (category) {
          case "Smileys & Emotion":
            icon = "sentiment_satisfied";
            break;
          case "People & Body":
            icon = "person";
            break;
          case "Animals & Nature":
            icon = "pets";
            break;
          case "Food & Drink":
            icon = "restaurant_menu";
            break;
          case "Travel & Places":
            icon = "directions_car";
            break;
          case "Activities":
            icon = "sports_basketball";
            break;
          case "Objects":
            icon = "emoji_objects";
            break;
          case "Symbols":
            icon = "favorite";
            break;
          case "Flags":
            icon = "flag";
            break;
          default:
            icon = "sentiment_satisfied";
            break;
        }

        htmlHeader += `<button class="cherry-emoji-item-btn cherry-emoji-item_${icon}" ><span class="material-symbols-outlined">
${icon}
</span></button>`;

        let html = `
<div class="cherry-emoji-panel cherry-emoji-item_${icon}">
  <div class="cherry-emoji-category">${category}</div>
  <div class="cherry-emoji-container">
  `;
        html += emojis
          .map((emoji) => {
            return `<span class="cherry-emoji-item" data-emoji="${emoji.emoji}" data-alias="${
              emoji.aliases[0]
            }">${getEmoji(emoji.emoji, this.$cherry.options.engine.syntax.emoji, true)}</span>`;
          })
          .join('');

        html += `
</div>
</div>
`;

        return html;
      })
      .join('');
    htmlHeader += `</div>`;
    htmlBody += emojiStackDOM;
    htmlBody += `<div class="cherry-emoji-panel cherry-emoji-item_search">
  <div class="cherry-emoji-category">搜索</div>
  <div class="cherry-emoji-container">`;

    htmlBody += `</div></div>`;
    return htmlHeader +htmlSearch+ htmlBody;
  }

  getDom() {
    const $colorWrap = document.createElement('div');
    $colorWrap.classList.add('cherry-dropdown');
    $colorWrap.classList.add('cherry-emoji-wrap');

    const $textWrap = document.createElement('div');
    $textWrap.innerHTML = this.getEmojiDom();
    $colorWrap.appendChild($textWrap);

    return $colorWrap;
  }

  init() {
    // 使用reduce方法对数组进行分类
    this.categorizedEmojis = gfmUnicode.emojis.reduce((acc, emoji) => {
      // 检查累加器中是否已存在该类别
      if (!acc[emoji.category]) {
        // 如果不存在，创建一个新的类别数组
        acc[emoji.category] = [];
      }
      // 将emoji对象推入对应的类别数组中
      acc[emoji.category].push(emoji);
      // 返回更新后的累加器对象
      return acc;
    }, {});
    this.dom = this.getDom();
    this.editor.options.wrapperDom.appendChild(this.dom);
    this.setActive(".cherry-emoji-item_sentiment_satisfied");
  }

  onClick() {
    return `:${this.emojiKey}:`;
  }

  removeAllActive(){
    this.dom.querySelectorAll('.cherry-emoji-panel').forEach((item)=>{
      item.classList.remove('show');
    })
    this.dom.querySelectorAll('.cherry-emoji-item-btn').forEach((item)=>{
      item.classList.remove('show');
    })
  }

  setActive(className){
    this.dom.querySelectorAll(className).forEach((item)=>{
      item.classList.add('show');
    })

  }

  initAction() {
    // const self = this;
    this.dom.addEventListener(
      'click',
      (evt) => {
        const { target } = /** @type {MouseEvent & {target:HTMLElement}}*/ (evt);

        // 点击emoji

        let targetClassList = target.classList;
        if (target.parentElement.classList.contains('cherry-emoji-item-btn')) {
          targetClassList = target.parentElement.classList;
        }

        if (targetClassList.contains('cherry-emoji-item-btn')) {
          this.removeAllActive();
          for (let i = 0; i < targetClassList.length; i++) {
            let item = targetClassList[i];
            if (item.startsWith('cherry-emoji-item_')) {
              let selector = `.${item}`;
              this.setActive(selector);
              break; // 退出循环
            }
          }
          return false;
        }



        this.emojiValue = target.getAttribute('data-emoji');
        this.emojiKey = target.getAttribute('data-alias');
        if (!this.emojiValue || !this.emojiKey) {
          return false;
        }
        this.$emoji.setCacheOnce({ emoji: this.emojiKey });
        this.$emoji.fire(null);
      },
      true,
    );
    this.dom.addEventListener('EditorHideToolbarSubMenu', () => {
      if (this.dom.style.display !== 'none') {
        this.dom.style.display = 'none';
      }
    });
   let input = this.dom.querySelector('.cherry-emoji-search-input');
   input.addEventListener('focus', (evt) => {
      this.removeAllActive();
      this.setActive('.cherry-emoji-item_search');
      //触发input事件
      input.dispatchEvent(new Event('input'));
   });
    input.addEventListener('input', (evt) => {
      let value = input.value;
      if (value === '') {
        return;
      }
      let searchResult = this.searchEmoji(value);
      let html = searchResult
        .map((emoji) => {
          return `<span class="cherry-emoji-item" data-emoji="${emoji.emoji}" data-alias="${
            emoji.aliases[0]
          }">${getEmoji(emoji.emoji, this.$cherry.options.engine.syntax.emoji, true)}</span>`;
        })
        .join('');
      let searchPanel = this.dom.querySelector('.cherry-emoji-item_search .cherry-emoji-container');
      searchPanel.innerHTML = html;
    });
  }
  searchEmoji(value) {
    let searchResult = [];
    for (const emoji of gfmUnicode.emojis) {

      for (const alias of emoji.aliases) {
        if (alias.includes(value)) {
          searchResult.push(emoji);
        }
      }

      for (const tag of emoji.tags) {
        if (tag.includes(value)) {
          searchResult.push(emoji);
        }
      }
    }
    return searchResult;
  }

  /**
   * 在对应的坐标展示调色盘
   * @param {Object} 坐标
   */
  show({ left, top, $emoji }) {
    this.dom.style.left = `${left}px`;
    this.dom.style.top = `${top}px`;
    this.dom.style.display = 'block';
    this.$emoji = $emoji;
  }
}
