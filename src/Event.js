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
import mitt from 'mitt';

/**
 * 事件管理
 */
export default new (class Event {
  /**
   * 事件列表
   * @property
   */
  Events = {
    previewerClose: 'previewerClose',
    previewerOpen: 'previewerOpen',
    editorClose: 'editorClose',
    editorOpen: 'editorOpen',
    toolbarHide: 'toolbarHide',
    toolbarShow: 'toolbarShow',
    modelChange: 'modelChange',
    cleanAllSubMenus: 'cleanAllSubMenus', // 清除所有子菜单弹窗
    afterChange: 'afterChange', // 编辑器内容变化
    afterInit: 'afterInit', // 编辑器初始化完成
    focus: 'focus', // 焦点
    blur: 'blur', // 失焦
    selectionChange: 'selectionChange', // 选区内容改变时触发
  };

  /**
   * @property
   * @private
   * @type {import('mitt').Emitter}
   */
  emitter = mitt();

  /**
   * 注册监听事件
   * @param {string} instanceId 接收消息的频道
   * @param {string} event 要注册监听的事件
   * @param {(event: any) => void} handler 事件回调
   */
  on(instanceId, event, handler) {
    // console.warn('事件注册', `${instanceId}:${event}`);
    this.emitter.on(`${instanceId}:${event}`, handler);
  }

  /**
   * 触发事件
   * @param {string} instanceId 发送消息的频道
   * @param {string} event 要触发的事件
   * @param {any} param 触发时传入的参数
   */
  emit(instanceId, event, ...param) {
    // console.warn('事件触发', `${instanceId}:${event}`, param);
    this.emitter.emit(`${instanceId}:${event}`, param);
  }

  off(instanceId, event, handler) {
    this.emitter.off(`${instanceId}:${event}`, handler);
  }
})();
