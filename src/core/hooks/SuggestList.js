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
/*
 * 系统联想候选表，主要为'、'以及'、'的联想。
 */
const SystemSuggestdata = [
  {
    icon: 'h1',
    key: '一级标题',
    keyword: 'head1',
    value: '# ',
  },
  {
    icon: 'h2',
    key: '二级标题',
    keyword: 'head2',
    value: '## ',
  },
  {
    icon: 'h3',
    key: '三级标题',
    keyword: 'head3',
    value: '### ',
  },
  {
    icon: 'table',
    key: '表格',
    keyword: 'table',
    value: '| Header | Header | Header |\n| --- | --- | --- |\n| Content | Content | Content |\n',
  },
  {
    icon: 'code',
    key: '代码',
    keyword: 'code',
    value: '```\n\n```\n',
  },
  {
    icon: 'link',
    key: '链接',
    keyword: 'link',
    value: `[title](https://url)`,
    selection: { from: 'title](https://url)'.length, to: '](https://url)'.length },
  },
  {
    icon: 'checkdata',
    key: '待办列表',
    keyword: 'checkdata',
    value: `- [ ] item\n- [x] item`,
  },
  {
    icon: 'tips',
    key: '面板',
    keyword: 'panel tips info warning danger success',
    value: `::: primary title\ncontent\n:::\n`,
  },
  {
    icon: 'insertFlow',
    key: '详情',
    keyword: 'detail',
    value: `+++ 点击展开更多\n内容\n++- 默认展开\n内容\n++ 默认收起\n内容\n+++\n`,
  },
];
/**
 *
 * @param {Suggester} suggester
 * @returns
 * */
export const systemSuggests = (suggester) => [
  {
    keyword: ':',
    data(keywords, callback, $cherry) {
      callback(fuzzySearchKeysWithValues(keywords, $cherry.options.engine.syntax.emoji));
    },
  },
  {
    keyword: '￥$',
    data: [
      {
        key: suggester.$locale.latexFormula,
        keyword: '',
        value: `$$`,
        goLeft: 1,
      },
      {
        key: suggester.$locale.latexFormulaInline,
        keyword: '$$',
        value: `$$\n\n$$`,
        goLeft: 4,
      },
    ],
  },
  {
    keyword: '<《【{[',
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
        icon: 'link',
        key: suggester.$locale.link,
        keyword: '[',
        value: `[title](https://url)`,
        selection: { from: 'title](https://url)'.length, to: '](https://url)'.length },
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
    ],
  },
  {
    keyword: '>》',
    data: [
      {
        key: '引用',
        keyword: '',
        value: `>`,
        goLeft: 1,
      },
    ],
  },
  {
    keyword: '\'"`',
    data: [
      {
        key: '代码块',
        keyword: '``',
        value: `\`\`\`\n\n\`\`\``,
        goLeft: 1,
      },
      {
        key: '行内代码',
        keyword: '`',
        value: `\`\``,
        goLeft: 1,
      },
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
    ],
  },
];
