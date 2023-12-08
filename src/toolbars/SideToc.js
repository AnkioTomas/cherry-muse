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
import { createElement } from '@/utils/dom';
import Event from '../Event';
export default class SideToc {
  constructor() {
    const that = this;
    Event.on('editor', 'change', function (editor) {
      that.renderToc(editor[0].getToc());
    });
  }
  createTocList() {
    this.tocList = createElement('div', 'cherry-toc');
    this.tocList.style.display = 'none'; // 默认隐藏目录
    return this.tocList;
  }
  renderToc(data) {
    const container = this.tocList;
    container.innerHTML = '';
    const currentList = document.createElement('ul');
    container.appendChild(currentList);

    const listStack = [currentList]; // 用于跟踪嵌套的列表

    data.forEach((item) => {
      const levelIndex = item.level - 1; // 数组索引从 0 开始

      // 确保堆栈中有足够的列表元素
      while (listStack.length <= levelIndex) {
        const newList = document.createElement('ul');
        listStack[listStack.length - 1].appendChild(newList);
        listStack.push(newList);
      }

      // 回退到适当的层级
      while (listStack.length > levelIndex + 1) {
        listStack.pop();
      }

      const listItem = document.createElement('li');
      listItem.innerHTML = item.text.replace(
        `class="anchor"`,
        `class="anchor" style="padding-left:${20 * levelIndex}px"`,
      );
      listStack[levelIndex].appendChild(listItem);
    });
  }
}
