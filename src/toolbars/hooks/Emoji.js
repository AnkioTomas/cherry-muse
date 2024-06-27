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
    let $selection = getSelection(this.editor.editor, selection) || this.locale.emoji;
    if (this.hasCacheOnce()) {
      // @ts-ignore
      const { emoji } = this.getAndCleanCacheOnce();
      const begin = `:${emoji}`;
      const end = ':';
      if (!this.isSelections && !this.$testIsEmoji($selection)) {
        this.getMoreSelection(begin, end, () => {
          const newSelection = this.editor.editor.getSelection();
          if (this.$testIsEmoji(newSelection)) {
            $selection = newSelection;
            $selection = newSelection;
            return true;
          }
          return false;
        });
      }
      if (this.$testIsEmoji($selection)) {
        const reg = new RegExp(`(^\s*${end})(\S+)([\s\S]+${end}\s*$)`, 'gm');

        let needClean = true;
        const tmp = $selection.replace(reg, (w, m1, m2, m3) => {
          needClean = needClean ? m2 === emoji : false;
          return `${m1}${emoji}${m3}`;
        });
        if (needClean) {
          return $selection.replace(reg, '$3').replace(/:$/gm, '');
        }
        this.registerAfterClickCb(() => {
          this.setLessSelection(begin, end);
        });
        return tmp;
      }
      this.registerAfterClickCb(() => {
        this.setLessSelection(begin, end);
      });
      return `${begin}${$selection}${end}`;
    }
    console.log(event);
    // 定位调色盘应该出现的位置
    // 该按钮可能出现在顶部工具栏，
    // 也可能出现在选中文字时出现的bubble工具栏，
    // 也可能出现在新行出现的float工具栏
    let top = 0;
    let left = 0;
    if (event.target.closest('.cherry-bubble')) {
      const $emojiDom = /** @type {HTMLElement}*/ (event.target.closest('.cherry-bubble'));
      const clientRect = $emojiDom.getBoundingClientRect();
      top = clientRect.top + $emojiDom.offsetHeight;
      left =
        /** @type {HTMLElement}*/ (event.target.closest('.cherry-toolbar-format_emoji_fill')).offsetLeft +
        clientRect.left;
    } else {
      const $emojiDom = /** @type {HTMLElement}*/ (event.target.closest('.cherry-toolbar-format_emoji_fill'));
      const clientRect = $emojiDom.getBoundingClientRect();
      top = clientRect.top + $emojiDom.offsetHeight;
      left = clientRect.left;
    }
    this.updateMarkdown = false;
    // 【TODO】需要增加getMoreSelection的逻辑
    this.bubbleColor.show({
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
    const emojiStackDOM = Object.entries(this.categorizedEmojis)
      .map(([category, emojis]) => {
        let html = `<details>
  <summary class="cherry-emoji-category">${category}</summary>
  <div class="cherry-emoji-container">
  `;
        console.log(this.$cherry)
        html += emojis.map((emoji) => {
          return `<span class="cherry-emoji-item" data-emoji="${emoji.emoji}" data-alias="${
            emoji.aliases[0]
          }">${getEmoji(emoji.emoji, this.$cherry.options.engine.syntax.emoji, true)}</span>`;
        }).join('');

        html += `
</div>
</details>`;

        return html;
      })
      .join('');
    return emojiStackDOM;
  }


  getDom() {
    const $colorWrap = document.createElement('div');
    $colorWrap.classList.add('cherry-emoji-wrap');
    $colorWrap.classList.add('cherry-dropdown');
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
    console.log(this.categorizedEmojis);
    this.dom = this.getDom();
    this.editor.options.wrapperDom.appendChild(this.dom);
  }

  onClick() {
    if (/^:[\w-]+:/.test(this.selection)) {
      return this.selection.replace(/^:[\w-]+:/, `:${this.emojiKey}:`);
    }
    return `${this.selection} :${this.emojiKey}:`;
  }

  initAction() {
    // const self = this;
    this.dom.addEventListener(
      'click',
      (evt) => {
        const { target } = /** @type {MouseEvent & {target:HTMLElement}}*/ (evt);
        this.emojiValue = target.getAttribute('data-emoji');
        this.emojiKey = target.getAttribute('data-alias');
        if (!this.emojiValue || !this.emojiKey) {
          return false;
        }
        this.type = target.closest('.cherry-emoji-text') ? 'text' : 'bg';
        this.$emoji.setCacheOnce({ emoji: this.emojiKey });
        this.$emoji.fire(null);
      },
      false,
    );
    this.dom.addEventListener('EditorHideToolbarSubMenu', () => {
      if (this.dom.style.display !== 'none') {
        this.dom.style.display = 'none';
      }
    });
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
