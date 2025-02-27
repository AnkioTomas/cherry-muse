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
import Event from '@/Event';
/**
 * 切换预览/编辑模式的按钮
 * 该按钮不支持切换到双栏编辑模式
 * 只能切换成纯编辑模式和纯预览模式
 **/
export default class SwitchModel extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('switchPreview', 'preview');
    this.instanceId = $cherry.instanceId;
    this.attachEventListeners();
    this.model = $cherry.model;
    this.prevModel = this.model;
  }

  get isHidden() {
    return this.$previewerHidden;
  }

  set isHidden(state) {
    // 节流
    if (state === this.$previewerHidden) {
      return;
    }
    const icon = this.dom.querySelector('i');
    // 隐藏预览，按钮状态为打开预览
    if (state) {
      icon.innerText = 'preview';
      icon.title = this.locale.switchPreview;
    } else {
      icon.innerText = 'preview_off';
      icon.title = this.locale.switchEdit;
    }

    this.$previewerHidden = state;
  }

  attachEventListeners() {
    Event.on(this.instanceId, Event.Events.modelChange, ([model]) => {
      this.prevModel = this.model;
      this.model = model;
    });
  }

  onClick() {
    // const toolbar = this.dom.parentElement.parentElement;
    if (this.model !== 'previewOnly') {
      this.$cherry.switchModel('previewOnly', true);
      // toolbar.classList.add('preview-only');
      this.isHidden = false;
    } else {
      // toolbar.classList.remove('preview-only');
      if (this.prevModel === 'edit&preview') {
        this.$cherry.switchModel('edit&preview', true);
      } else if (this.prevModel === 'editOnly') {
        this.$cherry.switchModel('editOnly', true);
      }
      this.isHidden = true;
    }
  }
}
