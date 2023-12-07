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
import Editor from './Editor';
import Engine from './Engine';
import Previewer from './Previewer';
import Toolbar from './toolbars/Toolbar';
import ToolbarRight from './toolbars/ToolbarRight';
import { createElement } from './utils/dom';
import { customizer, getThemeFromLocal } from './utils/config';
import NestedError, { $expectTarget } from './utils/error';
import getPosBydiffs from './utils/recount-pos';
import defaultConfig from './Cherry.config';
import cloneDeep from 'lodash/cloneDeep';
import Event from './Event';
import locales from '@/locales/index';

import { urlProcessorProxy } from './UrlCache';
import { CherryStatic } from './CherryStatic';
import { LIST_CONTENT } from '@/utils/regexp';
import { Theme } from '@/Theme';
import SideToc from '@/toolbars/SideToc';

export default class Cherry extends CherryStatic {
  /**
   * @protected
   */
  static initialized = false;
  /**
   * @readonly
   */
  static config = {
    defaults: defaultConfig,
  };

  constructor(options) {
    super();
    Cherry.initialized = true;
    const defaultConfigCopy = cloneDeep(Cherry.config.defaults);
    this.defaultToolbar = defaultConfigCopy.toolbars.toolbar;
    $expectTarget(options, Object);

    this.options = mergeWith({}, defaultConfigCopy, options, customizer);

    // loading the locale
    this.locale = locales[this.options.locale];

    if (typeof this.options.engine.global.urlProcessor === 'function') {
      this.options.engine.global.urlProcessor = urlProcessorProxy(this.options.engine.global.urlProcessor);
    }

    this.status = {
      toolbar: 'show',
      previewer: 'show',
      editor: 'show',
    };

    if (this.options.isPreviewOnly || this.options.editor.defaultModel === 'previewOnly') {
      this.options.toolbars.showToolbar = false;
      this.options.editor.defaultModel = 'previewOnly';
      this.status.editor = 'hide';
      this.status.toolbar = 'hide';
    }

    /**
     * @property
     * @type {string} 实例ID
     */
    this.instanceId = `cherry-${new Date().getTime()}${Math.random()}`;
    this.options.instanceId = this.instanceId;

    this.engine = new Engine(this.options, this);
    this.init();
  }

  /**
   * 初始化工具栏、编辑区、预览区等
   * @private
   */
  init() {
    let mountEl = this.options.id ? document.getElementById(this.options.id) : this.options.el;

    if (!mountEl) {
      if (!this.options.forceAppend) {
        return false;
      }
      mountEl = document.createElement('div');
      mountEl.id = this.options.id || 'cherry-markdown';
      document.body.appendChild(mountEl);
    }

    if (!mountEl.style.height) {
      mountEl.style.height = this.options.editor.height;
    }
    this.cherryDom = mountEl;

    // 蒙层dom，用来拖拽编辑区&预览区宽度时展示蒙层
    const wrapperDom = this.createWrapper();
    // 创建目录预览区
    this.tocList = new SideToc().createTocList();
    // 创建编辑区
    const editor = this.createEditor();
    // 创建预览区
    const previewer = this.createPreviewer();

    if (this.options.toolbars.showToolbar === false || this.options.toolbars.toolbar === false) {
      // 即便配置了不展示工具栏，也要让工具栏加载对应的语法hook
      wrapperDom.classList.add('cherry--no-toolbar');
      this.options.toolbars.toolbar = this.defaultToolbar;
    }
    $expectTarget(this.options.toolbars.toolbar, Array);
    // 创建顶部工具栏
    this.createToolbar();
    this.createToolbarRight();

    const wrapperFragment = document.createDocumentFragment();
    wrapperFragment.appendChild(this.toolbar.options.dom);
    wrapperFragment.appendChild(this.tocList);
    wrapperFragment.appendChild(editor.options.editorDom);
    // 创建预览区域的侧边工具栏
    if (!this.options.previewer.dom) {
      wrapperFragment.appendChild(previewer.options.previewerDom);
    }
    wrapperFragment.appendChild(previewer.options.virtualDragLineDom);
    wrapperFragment.appendChild(previewer.options.editorMaskDom);
    wrapperFragment.appendChild(previewer.options.previewerMaskDom);

    wrapperDom.appendChild(wrapperFragment);
    mountEl.appendChild(wrapperDom);

    editor.init(previewer);

    previewer.init(editor);

    previewer.registerAfterUpdate(this.engine.mounted.bind(this.engine));

    // default value init
    this.initText(editor.editor);

    Event.on(this.instanceId, Event.Events.toolbarHide, () => {
      this.status.toolbar = 'hide';
    });
    Event.on(this.instanceId, Event.Events.toolbarShow, () => {
      this.status.toolbar = 'show';
    });
    Event.on(this.instanceId, Event.Events.previewerClose, () => {
      this.status.previewer = 'hide';
    });
    Event.on(this.instanceId, Event.Events.previewerOpen, () => {
      this.status.previewer = 'show';
    });
    Event.on(this.instanceId, Event.Events.editorClose, () => {
      this.status.editor = 'hide';
      // 关闭编辑区时，需要清除所有高亮
      this.previewer.highlightLine(0);
    });
    Event.on(this.instanceId, Event.Events.editorOpen, () => {
      this.status.editor = 'show';
    });

    // 切换模式，有纯预览模式、纯编辑模式、双栏编辑模式
    this.switchModel(this.options.editor.defaultModel);

    Theme.init(this);
  }

  /**
   * 切换编辑模式
   * @param {'edit&preview'|'editOnly'|'previewOnly'} [model=edit&preview] 模式类型
   * 一般纯预览模式和纯编辑模式适合在屏幕较小的终端使用，比如手机移动端
   */
  switchModel(model = 'edit&preview') {
    switch (model) {
      case 'edit&preview':
        if (this.previewer) {
          this.previewer.editOnly(true);
          this.previewer.recoverPreviewer();
        }
        if (this.toolbar) {
          this.toolbar.showToolbar();
        }
        break;
      case 'editOnly':
        if (!this.previewer.isPreviewerHidden()) {
          this.previewer.editOnly(true);
        }
        if (this.toolbar) {
          this.toolbar.showToolbar();
        }
        break;
      case 'previewOnly':
        this.previewer.previewOnly();
        this.toolbar && this.toolbar.previewOnly();
        break;
    }
  }

  /**
   * 获取实例id
   * @returns {string}
   * @public
   */
  getInstanceId() {
    return this.instanceId;
  }

  /**
   * 获取编辑器状态
   * @returns  {Object}
   */
  getStatus() {
    return this.status;
  }

  /**
   * 获取编辑区内的markdown源码内容
   * @returns string
   */
  getValue() {
    return this.editor.editor.getValue();
  }

  /**
   * 获取编辑区内的markdown源码内容
   * @returns {string} markdown源码内容
   */
  getMarkdown() {
    return this.getValue();
  }

  /**
   * 获取CodeMirror 实例
   * @returns { CodeMirror.Editor } CodeMirror实例
   */
  getCodeMirror() {
    return this.editor.editor;
  }

  /**
   * 获取预览区内的html内容
   * @param {boolean} [wrapTheme=true] 是否在外层包裹主题class
   * @returns {string} html内容
   */
  getHtml(wrapTheme = true) {
    return this.previewer.getValue(wrapTheme);
  }
  /**
   * 获取Previewer 预览实例
   * @returns {Previewer} Previewer 预览实例
   */
  getPreviewer() {
    return this.previewer;
  }

  /**
   * @typedef {{
   *  level: number;
   * id: string;
   * text: string;
   * }[]} HeaderList
   * 获取目录，目录由head1~6组成
   * @returns {HeaderList} 标题head数组
   */
  getToc() {
    const str = this.getHtml();
    /** @type {({level: number;id: string;text: string})[]} */
    const headerList = [];
    const headerRegex = /<h([1-6]).*?id="([^"]+?)".*?>(.+?)<\/h[0-6]>/g;
    str.replace(headerRegex, (match, level, id, text) => {
      headerList.push({ level: +level, id, text });
      return match;
    });
    return headerList;
  }

  /**
   * 覆盖编辑区的内容
   * @param {string} content markdown内容
   * @param {boolean} keepCursor 是否保持光标位置
   */
  setValue(content, keepCursor = false) {
    if (keepCursor === false) {
      return this.editor.editor.setValue(content);
    }
    const codemirror = this.editor.editor;
    const old = this.getValue();
    const pos = codemirror.getDoc().indexFromPos(codemirror.getCursor());
    const newPos = getPosBydiffs(pos, old, content);
    codemirror.setValue(content);
    const cursor = codemirror.getDoc().posFromIndex(newPos);
    codemirror.setCursor(cursor);
  }

  /**
   * 在光标处或者指定行+偏移量插入内容
   * @param {string} content 被插入的文本
   * @param {boolean} [isSelect=false] 是否选中刚插入的内容
   * @param {[number, number]|false} [anchor=false] [x,y] 代表x+1行，y+1字符偏移量，默认false 会从光标处插入
   * @param {boolean} [focus=true] 保持编辑器处于focus状态
   */
  insert(content, isSelect = false, anchor = false, focus = true) {
    if (anchor) {
      this.editor.editor.setSelection({ line: anchor[0], ch: anchor[1] }, { line: anchor[0], ch: anchor[1] });
    }
    this.editor.editor.replaceSelection(content, isSelect ? 'around' : 'end');
    focus && this.editor.editor.focus();
  }

  /**
   * 在光标处或者指定行+偏移量插入内容
   * @param {string} content 被插入的文本
   * @param {boolean} [isSelect=false] 是否选中刚插入的内容
   * @param {[number, number]|false} [anchor=false] [x,y] 代表x+1行，y+1字符偏移量，默认false 会从光标处插入
   * @param {boolean} [focus=true] 保持编辑器处于focus状态
   * @returns
   */
  insertValue(content, isSelect = false, anchor = false, focus = true) {
    return this.insert(content, isSelect, anchor, focus);
  }

  /**
   * 强制重新渲染预览区域
   */
  refreshPreviewer() {
    try {
      const markdownText = this.getValue();
      const html = this.engine.makeHtml(markdownText);
      this.previewer.refresh(html);
    } catch (e) {
      throw new NestedError(e);
    }
  }

  /**
   * 覆盖编辑区的内容
   * @param {string} content markdown内容
   * @param {boolean} [keepCursor=false] 是否保持光标位置
   */
  setMarkdown(content, keepCursor = false) {
    return this.setValue(content, keepCursor);
  }

  /**
   * @private
   * @returns
   */
  createWrapper() {
    const wrapperDom = createElement('div', ['cherry', 'clearfix', Theme.getTheme()].join(' '), {
      'data-toolbarTheme': '',
      'data-inlineCodeTheme': Theme.getTheme(),
      'data-codeBlockTheme': Theme.getTheme(),
    });
    this.wrapperDom = wrapperDom;
    return wrapperDom;
  }

  /**
   * @private
   * @returns {Toolbar}
   */
  createToolbar() {
    const dom = createElement('div', 'cherry-toolbar');
    this.toolbarContainer = dom;
    this.toolbar = new Toolbar({
      dom,
      $cherry: this,
      buttonConfig: this.options.toolbars.toolbar,
      customMenu: this.options.toolbars.customMenu,
      shortcutKey: this.options.toolbars.shortcutKey,
    });
    return this.toolbar;
  }

  /**
   * @private
   * @returns {Toolbar}
   */
  createToolbarRight() {
    this.toolbarRight = new ToolbarRight({
      dom: this.toolbarContainer,
      $cherry: this,
      buttonConfig: this.options.toolbars.toolbarRight,
      customMenu: this.options.toolbars.customMenu,
    });
    this.toolbar.collectMenuInfo(this.toolbarRight);
    return this.toolbarRight;
  }

  /**
   * @private
   * @returns {import('@/Editor').default}
   */
  createEditor() {
    const textArea = createElement('textarea', '', {
      id: this.options.editor.id ?? 'code',
      name: this.options.editor.name ?? 'code',
    });
    textArea.textContent = this.options.value;
    const editor = createElement('div', 'cherry-editor');
    editor.appendChild(textArea);

    this.editor = new Editor({
      $cherry: this,
      editorDom: editor,
      wrapperDom: this.wrapperDom,
      value: this.options.value,
      onKeydown: this.fireShortcutKey.bind(this),
      onChange: this.editText.bind(this),
      toolbars: this.options.toolbars,
      fileUpload: this.options.fileUpload,
      autoScrollByCursor: this.options.autoScrollByCursor,
      ...this.options.editor,
    });
    return this.editor;
  }

  /**
   * @private
   * @returns {import('@/Previewer').default}
   */
  createPreviewer() {
    /** @type {HTMLDivElement} */
    let previewer;
    const anchorStyle =
      (this.options.engine.syntax.header && this.options.engine.syntax.header.anchorStyle) || 'default';
    const autonumberClass = anchorStyle === 'autonumber' ? ' head-num' : '';
    const { className, dom, enablePreviewerBubble } = this.options.previewer;
    const previewerClassName = [
      'cherry-previewer cherry-markdown',
      className || '',
      autonumberClass,
      getThemeFromLocal(true),
    ].join(' ');
    if (dom) {
      previewer = dom;
      previewer.className += ` ${previewerClassName}`;
    } else {
      previewer = createElement('div', previewerClassName);
    }
    const virtualDragLine = createElement('div', 'cherry-drag');
    const editorMask = createElement('div', 'cherry-editor-mask');
    const previewerMask = createElement('div', 'cherry-previewer-mask');

    this.previewer = new Previewer({
      $cherry: this,
      virtualDragLineDom: virtualDragLine,
      editorMaskDom: editorMask,
      previewerMaskDom: previewerMask,
      previewerDom: previewer,
      value: this.options.value,
      isPreviewOnly: this.options.isPreviewOnly,
      enablePreviewerBubble,
      lazyLoadImg: this.options.previewer.lazyLoadImg,
    });

    return this.previewer;
  }

  /**
   * @private
   * @param {import('codemirror').Editor} codemirror
   */
  initText(codemirror) {
    try {
      const markdownText = codemirror.getValue();
      const html = this.engine.makeHtml(markdownText);
      this.previewer.update(html);
      if (this.options.callback.afterInit) {
        this.options.callback.afterInit(markdownText, html);
      }
    } catch (e) {
      throw new NestedError(e);
    }
  }

  /**
   * @private
   * @param {Event} _evt
   * @param {import('codemirror').Editor} codemirror
   */
  editText(_evt, codemirror) {
    const that = this;
    try {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        const markdownText = codemirror.getValue();
        const html = this.engine.makeHtml(markdownText);
        this.previewer.update(html);
        if (this.options.callback.afterChange) {
          this.options.callback.afterChange(markdownText, html);
        }

        Event.emit('editor', 'change', that);
        // 强制每次编辑（包括undo、redo）编辑器都会自动滚动到光标位置
        codemirror.scrollIntoView(null);
      }, 50);
    } catch (e) {
      throw new NestedError(e);
    }
  }

  /**
   * @private
   * @param {any} cb
   */
  onChange(cb) {
    this.editor.editor.on('change', (codeMirror) => {
      cb({
        markdown: codeMirror.getValue(), // 后续可以按需增加html或其他状态
      });
    });
  }

  /**
   * @private
   * @param {KeyboardEvent} evt
   */
  fireShortcutKey(evt) {
    const cursor = this.editor.editor.getCursor();
    const lineContent = this.editor.editor.getLine(cursor.line);
    // shift + tab 已经被绑定为缩进，所以这里不做处理
    if (!evt.shiftKey && evt.key === 'Tab' && LIST_CONTENT.test(lineContent)) {
      // 每按一次Tab，如果当前光标在行首或者行尾，就在行首加一个\t
      if (cursor.ch === 0 || cursor.ch === lineContent.length || cursor.ch === lineContent.length + 1) {
        evt.preventDefault();
        this.editor.editor.setSelection({ line: cursor.line, ch: 0 }, { line: cursor.line, ch: lineContent.length });
        this.editor.editor.replaceSelection(`\t${lineContent}`, 'around');
        const newCursor = this.editor.editor.getCursor();
        this.editor.editor.setSelection(newCursor, newCursor);
      }
    }
    if (this.toolbar.matchShortcutKey(evt)) {
      // 快捷键
      evt.preventDefault();
      this.toolbar.fireShortcutKey(evt);
    }
  }

  /**
   * 导出预览区域内容
   * @public
   * @param {'pdf'  | 'markdown' | 'html'} [type='pdf']
   * 'pdf'：导出成pdf文件; 'img'：导出成png图片; 'markdown'：导出成markdown文件; 'html'：导出成html文件;
   * @param {string} [fileName] 导出文件名(默认为当前第一行内容|'cherry-export')
   */
  export(type = 'pdf', fileName = '') {
    this.previewer.export(type, fileName);
  }

  /**
   * 修改主题
   * @param {string} theme option.theme里的className
   */
  setTheme(theme = 'light') {
    Theme.setTheme(this, theme);
  }

  /**
   * 修改书写风格
   * @param {string} writingStyle normal 普通 | typewriter 打字机 | focus 专注
   */
  setWritingStyle(writingStyle) {
    this.editor.setWritingStyle(writingStyle);
  }
}
