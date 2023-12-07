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
import Event from '../../Event';
/**
 * 显示目录
 */
export default class TocList extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('tocListShow', 'subtitles');
    // subtitles_off
    this.changeToc(localStorage.getItem('tocShow'));
    Event.on($cherry.instanceId, Event.Events.previewerOpen, () => {
      localStorage.removeItem('tocShow');
      this.changeToc(false);
    });
  }

  changeToc(show) {
    let icon = null;
    if (this.dom) {
      icon = this.dom.querySelector('i');
    }

    if (show) {
      if (icon) {
        icon.innerText = 'subtitles_off';
        icon.title = this.locale.tocListHide;
        Event.emit('editor', 'change', this.$cherry);
      } else {
        this.setName('tocList', 'subtitles_off');
      }

      this.$cherry.tocList.style.display = 'block';
      this.$cherry.editor.getEditorDom().style.paddingLeft = '240px';
    } else {
      if (icon) {
        icon.innerText = 'subtitles';
        icon.title = this.locale.tocListShow;
      } else {
        this.setName('tocList', 'subtitles');
      }
      this.$cherry.tocList.style.display = 'none';
      this.$cherry.editor.getEditorDom().style.paddingLeft = '0px';
    }
  }

  /**
   * 响应点击事件
   * @param {string} selection 被用户选中的文本内容
   * @returns {string} 回填到编辑器光标位置/选中文本区域的内容
   */
  onClick(selection, shortKey = '') {
    if (localStorage.getItem('tocShow')) {
      localStorage.removeItem('tocShow');
    } else {
      localStorage.setItem('tocShow', '1');
    }
    this.changeToc(localStorage.getItem('tocShow'));
    return '';
  }
}
