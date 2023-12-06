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
/**
 * 插入面板
 */
export default class Badge extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('徽章', 'app_badging');
    this.subMenuConfig = [
      {
        iconName: 'question_mark',
        name: '提示徽章',
        onclick: this.bindSubClick.bind(this, 'primary'),
      },
      {
        iconName: 'info_i',
        name: '信息徽章',
        onclick: this.bindSubClick.bind(this, 'info'),
      },
      {
        iconName: 'priority_high',
        name: '警告徽章',
        onclick: this.bindSubClick.bind(this, 'warning'),
      },
      {
        iconName: 'close',
        name: '危险徽章',
        onclick: this.bindSubClick.bind(this, 'danger'),
      },
      {
        iconName: 'done',
        name: '成功徽章',
        onclick: this.bindSubClick.bind(this, 'success'),
      },
      {
        iconName: 'align_flex_start',
        name: '偏上',
        onclick: this.bindSubClick.bind(this, ['primary', 'top']),
      },
      {
        iconName: 'align_center',
        name: '居中',
        onclick: this.bindSubClick.bind(this, ['primary', 'center']),
      },
      {
        iconName: 'align_flex_end',
        name: '偏下',
        onclick: this.bindSubClick.bind(this, ['primary', 'bottom']),
      },
    ];
  }

  /**
   * 响应点击事件
   * @param {string} selection 被用户选中的文本内容
   * @param {string} shortKey 快捷键参数
   * @returns {string} 回填到编辑器光标位置/选中文本区域的内容
   */
  onClick(selection, shortKey = '') {
    const keys = typeof shortKey === 'string' ? [shortKey] : shortKey;
    const $selection = getSelection(this.editor.editor, selection, 'line', true) || '内容';
    return `{badge: ${$selection}|${keys[0]}|${keys.length > 1 ? keys[1] : 'center'}}`;
  }
}
