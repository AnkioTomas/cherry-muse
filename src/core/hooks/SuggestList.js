/**
 * Tencent is pleased to support the open source community by making CherryMarkdown available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company. All rights reserved.
 * The below software in this distribution may have been modified by THL A29 Limited ("Tencent Modifications").
 *
 * All Tencent Modifications are Copyright (C) THL A29 Limited.
 *
 * CherryMarkdown is licensed under the Apache License, Version 2.0 (the "License");
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
/*
 * 外加配置系统联想词
 */
import { fuzzySearchKeysWithValues } from '@/core/hooks/Emoji';
import { expandList, getSuggestList } from './Suggester';

/**
 *
 * @param {Suggester} suggester
 * @returns
 * */
export const systemSuggests = [
  {
    keyword: ':：；;',
    data(keywords, callback, $cherry, key) {
      // 面板语法提示
      getSuggestList(
        expandList($cherry, [
          {
            toolbar: 'panel',
            keyword: 'panel',
            goLeft: 4,
          },
        ]),
        key,
        keywords,
        (res) => {
          let ret = [];
          if (res) {
            ret = ret.concat(res);
          }
          ret = ret.concat(fuzzySearchKeysWithValues(keywords, $cherry.options.engine.syntax.emoji));
          callback(ret);
        },
      );
    },
  },
  {
    keyword: '￥$', // 公式语法提示
    data: [
      {
        key: 'latexFormulaInline',
        keyword: '',
        icon: 'function',
        value: `$x^2$`,
        goLeft: 1,
      },
      {
        key: 'latexFormula',
        keyword: '$$',
        icon: 'function',
        value: `\n$$\nx^2\n$$\n`,
        goLeft: 4,
      },
    ],
  },
  {
    keyword: '<《【{[', // 括号、脚注、链接、徽章
    data: [
      {
        key: '[]',
        keyword: '[',
        value: `[]`,
        goLeft: 1,
      },
      {
        key: '【】',
        keyword: '【',
        value: `【】`,
        goLeft: 1,
      },

      {
        key: '()',
        keyword: '（',
        value: `()`,
        goLeft: 1,
      },
      {
        key: '（）',
        keyword: '（',
        value: `（）`,
        goLeft: 1,
      },
      {
        key: '<>',
        keyword: '<',
        value: `<>`,
        goLeft: 1,
      },
      {
        key: '《》',
        keyword: '《',
        value: `《》`,
        goLeft: 1,
      },
      {
        toolbar: 'link',
        keyword: 'link',
      },
      {
        icon: 'edit_note',
        key: 'footNoteTitle',
        keyword: '^',
        value: `[^脚注标题]`,
      },
      {
        icon: 'text_snippet',
        key: 'footNoteText',
        keyword: '^',
        value: `[^脚注标题]: 脚注内容`,
      },
      {
        toolbar: 'badge',
        keyword: 'badge',
      },
    ],
  },
  {
    keyword: '>》', // 引用
    data: [
      {
        toolbar: 'quote',
        keyword: '',
        goLeft: 1,
      },
    ],
  },
  {
    keyword: '#', // 标题
    data: [
      {
        toolbar: 'header',
        keyword: '',
      },
    ],
  },
  {
    keyword: '*/', // 加粗、下划线、删除线
    data: [
      {
        toolbar: 'bold',
        keyword: '',
      },
      {
        toolbar: 'italic',
        keyword: '',
      },
      {
        toolbar: 'underline',
      },
    ],
  },
  {
    keyword: '-=', // 高亮、checklist、列表、删除线、下划线
    data: [
      {
        icon: 'highlight',
        key: 'highlight',
        keyword: '==',
        value: `====`,
        goLeft: 2,
      },
      {
        toolbar: 'checklist',
        goLeft: 3,
      },
      {
        toolbar: 'ol',
      },
      {
        toolbar: 'ul',
      },
      {
        toolbar: 'strikethrough',
      },
      {
        toolbar: 'underline',
      },
    ],
  },
  {
    keyword: `|`, // 各种表格
    data: [
      {
        toolbar: 'table',
      },
      {
        toolbar: 'lineTable',
        keyword: 'line',
      },
      {
        toolbar: 'barTable',
        keyword: 'bar',
      },
    ],
  },
  {
    keyword: `!！`, // 各种文件
    data: [
      {
        icon: 'image',
        key: 'image',
        keyword: '[',
        value: `![描述#center](链接)`,
        goLeft: 1,
      },
      {
        icon: 'videocam',
        key: 'video',
        keyword: 'video',
        value: `!video[描述](链接)`,
        goLeft: 1,
      },
      {
        icon: 'mic',
        key: 'audio',
        keyword: 'audio',
        value: `!audio[描述](链接)`,
        goLeft: 1,
      },
      {
        icon: 'attach_file',
        key: 'file',
        keyword: 'file',
        value: `!file[名称|拓展名|密码](链接)`,
        goLeft: 1,
      },
    ],
  },
  {
    keyword: '\'"`', // 代码相关
    data: [
      {
        key: '" "',
        keyword: '"',
        value: `""`,
        goLeft: 1,
      },
      {
        key: `' '`,
        keyword: `'`,
        value: `''`,
        goLeft: 1,
      },
      {
        icon: 'code',
        key: 'codeBlock',
        keyword: '``',
        value: `\`\`\`\n\n\`\`\`\n`,
        goLeft: 4,
      },

      {
        key: 'code',
        icon: 'code',
        keyword: '`',
        value: `\`\``,
        goLeft: 1,
      },
      {
        toolbar: 'echarts',
        keyword: '```echarts',
      },
      {
        toolbar: 'graph',
        keyword: '```mermaid',
      },
      {
        toolbar: 'card',
        keyword: '```card',
      },
    ],
  },
];
