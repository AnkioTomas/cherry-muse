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
/**
 * 工具栏各个实例的注册中心
 */
import Bold from './hooks/Bold';
import Italic from './hooks/Italic';
import Split from './hooks/Split';
import Strikethrough from './hooks/Strikethrough';
import Sub from './hooks/Sub';
import Sup from './hooks/Sup';
import Color from './hooks/Color';
import Header from './hooks/Header';
import Insert from './hooks/Insert';
import List from './hooks/List';
import Ol from './hooks/Ol';
import Ul from './hooks/Ul';
import CheckList from './hooks/CheckList';
import Graph from './hooks/Graph';
import Size from './hooks/Size';
import H1 from './hooks/H1';
import H2 from './hooks/H2';
import H3 from './hooks/H3';
import Quote from './hooks/Quote';
import TogglePreview from './hooks/TogglePreview';
import FullScreen from './hooks/FullScreen';
import Undo from './hooks/Undo';
import Redo from './hooks/Redo';
import Code from './hooks/Code';
import Export from './hooks/Export';
import Underline from './hooks/Underline';
import SwitchModel from './hooks/SwitchModel';
import Image from './hooks/Image';
import Audio from './hooks/Audio';
import Video from './hooks/Video';
import Br from './hooks/Br';
import Hr from './hooks/Hr';
import Link from './hooks/Link';
import Table from './hooks/Table';
import Toc from './hooks/Toc';
import LineTable from './hooks/LineTable';
import BarTable from './hooks/BarTable';

import File from './hooks/File';
import Ruby from './hooks/Ruby';
// SideToc
import Copy from './hooks/Copy';
import Panel from './hooks/Panel';
import Detail from './hooks/Detail';
import Badge from './hooks/Badge';
import ECharts from './hooks/ECharts';
import Card from '@/toolbars/hooks/Card';
import Formula from '@/toolbars/hooks/Formula';
import Emoji from '@/toolbars/hooks/Emoji';
import Iframe from '@/toolbars/hooks/Iframe';
// 定义默认支持的工具栏
// 目前不支持按需动态加载
// 如果对CherryMarkdown构建后的文件大小有比较严格的要求，可以根据实际情况删减hook
const HookList = {
  bold: Bold,
  italic: Italic,
  '|': Split,
  strikethrough: Strikethrough,
  sub: Sub,
  sup: Sup,
  header: Header,
  insert: Insert,
  list: List,
  ol: Ol,
  ul: Ul,
  checklist: CheckList,
  graph: Graph,
  size: Size,
  h1: H1,
  h2: H2,
  h3: H3,
  color: Color,
  quote: Quote,
  togglePreview: TogglePreview,
  code: Code,
  export: Export,
  fullScreen: FullScreen,
  copy: Copy,
  undo: Undo,
  redo: Redo,
  underline: Underline,
  switchModel: SwitchModel,
  image: Image,
  audio: Audio,
  video: Video,
  br: Br,
  hr: Hr,
  link: Link,
  table: Table,
  toc: Toc,
  lineTable: LineTable,
  barTable: BarTable,
  ruby: Ruby,
  file: File,
  panel: Panel,
  detail: Detail,
  badge: Badge,
  echarts: ECharts,
  card: Card,
  formula: Formula,
  emoji: Emoji,
  iframe: Iframe,
};

export default class HookCenter {
  constructor(toolbar) {
    this.toolbar = toolbar;
    /**
     * @type {{[key: string]: import('@/toolbars/MenuBase').default}} 保存所有菜单实例
     */
    this.hooks = {};
    /**
     * @type {string[]} 所有注册的菜单名称
     */
    this.allMenusName = [];
    /**
     * @type {string[]} 一级菜单的名称
     */
    this.level1MenusName = [];
    /**
     * @type {{ [parentName: string]: string[]}} 二级菜单的名称, e.g. {一级菜单名称: [二级菜单名称1, 二级菜单名称2]}
     */
    this.level2MenusName = {};
    this.init();
  }

  $newMenu(name) {
    if (this.hooks[name]) {
      return;
    }
    const { $cherry, customMenu } = this.toolbar.options;
    if (HookList[name]) {
      this.allMenusName.push(name);
      this.hooks[name] = new HookList[name]($cherry);
    } else if (customMenu !== undefined && customMenu !== null && customMenu[name]) {
      this.allMenusName.push(name);
      // 如果是自定义菜单，传参兼容旧版
      this.hooks[name] = new customMenu[name]($cherry);
    }
  }

  /**
   * 根据配置动态渲染、绑定工具栏
   * @returns
   */
  init() {
    const { buttonConfig } = this.toolbar.options;
    buttonConfig.forEach((item) => {
      if (typeof item === 'string') {
        this.level1MenusName.push(item);
        this.$newMenu(item);
      } else if (typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length === 1) {
          // 只接受形如{ name: [ subMenu ] }的参数
          const [name] = keys;
          this.level1MenusName.push(name);
          this.$newMenu(name);
          this.level2MenusName[name] = item[name];
          item[name].forEach((subItem) => {
            this.$newMenu(subItem);
          });
        }
      }
    });
  }
}
