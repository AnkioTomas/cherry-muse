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
export const addonsKeywords = '#';
/*
 * 预留联想词
 */
export const suggesterKeywords = '/·￥、：“”【】（）《》'.concat(addonsKeywords);
/*
 * 系统联想候选表，主要为'、'以及'、'的联想。
 */
const SystemSuggestList = [
  {
    icon: 'h1',
    label: '一级标题',
    keyword: 'head1',
    value: '# ',
  },
  {
    icon: 'h2',
    label: '二级标题',
    keyword: 'head2',
    value: '## ',
  },
  {
    icon: 'h3',
    label: '三级标题',
    keyword: 'head3',
    value: '### ',
  },
  {
    icon: 'table',
    label: '表格',
    keyword: 'table',
    value: '| Header | Header | Header |\n| --- | --- | --- |\n| Content | Content | Content |\n',
  },
  {
    icon: 'code',
    label: '代码',
    keyword: 'code',
    value: '```\n\n```\n',
  },
  {
    icon: 'link',
    label: '链接',
    keyword: 'link',
    value: `[title](https://url)`,
    selection: { from: 'title](https://url)'.length, to: '](https://url)'.length },
  },
  {
    icon: 'checklist',
    label: '待办列表',
    keyword: 'checklist',
    value: `- [ ] item\n- [x] item`,
  },
  {
    icon: 'tips',
    label: '面板',
    keyword: 'panel tips info warning danger success',
    value: `::: primary title\ncontent\n:::\n`,
  },
  {
    icon: 'insertFlow',
    label: '详情',
    keyword: 'detail',
    value: `+++ 点击展开更多\n内容\n++- 默认展开\n内容\n++ 默认收起\n内容\n+++\n`,
  },
];
/*
 * 全角联想候选表，用于将全角转为半角。
 */
const HalfWidthSuggestList = [
  {
    icon: 'FullWidth',
    label: '`',
    keyword: '···',
    value: '`',
  },
  {
    icon: 'FullWidth',
    label: '$',
    keyword: '￥',
    value: '$',
  },
  {
    icon: 'FullWidth',
    label: '/',
    keyword: '、',
    value: '/',
  },
  {
    icon: 'FullWidth',
    label: '\\',
    keyword: '、',
    value: '\\',
  },
  {
    icon: 'FullWidth',
    label: ':',
    keyword: '：',
    value: ':',
  },
  {
    icon: 'FullWidth',
    label: '"',
    keyword: '“',
    value: '"',
  },
  {
    icon: 'FullWidth',
    label: '"',
    keyword: '”',
    value: '"',
  },
  {
    icon: 'FullWidth',
    label: '[',
    keyword: '【',
    value: '[',
  },
  {
    icon: 'FullWidth',
    label: ']',
    keyword: '】',
    value: ']',
  },
  {
    icon: 'FullWidth',
    label: '(',
    keyword: '（',
    value: '(',
  },
  {
    icon: 'FullWidth',
    label: ')',
    keyword: '）',
    value: ')',
  },
  {
    icon: 'FullWidth',
    label: '<',
    keyword: '《',
    value: '<',
  },
  {
    icon: 'FullWidth',
    label: '>',
    keyword: '》',
    value: '>',
  },
];
/*
 * 更多候选适配，
 * goLeft用于在选中联想之后向左移动一定距离光标，
 * selection用于选中光标，from-to即选中范围。
 */
const MoreSuggestList = [
  {
    icon: 'FullWidth',
    label: '[]',
    keyword: '【】',
    value: `[]`,
    goLeft: 1,
  },
  {
    icon: 'FullWidth',
    label: '【】',
    keyword: '【',
    value: `【】`,
    goLeft: 1,
  },
  {
    icon: 'link',
    label: 'Link',
    keyword: '【】',
    value: `[title](https://url)`,
    selection: { from: 'title](https://url)'.length, to: '](https://url)'.length },
  },
  {
    icon: 'FullWidth',
    label: '()',
    keyword: '（',
    value: `()`,
    goLeft: 1,
  },
  {
    icon: 'FullWidth',
    label: '（）',
    keyword: '（',
    value: `（）`,
    goLeft: 1,
  },
  {
    icon: 'FullWidth',
    label: '<>',
    keyword: '《》',
    value: `<>`,
    goLeft: 1,
  },
  {
    icon: 'FullWidth',
    label: '《》',
    keyword: '《》',
    value: `《》`,
    goLeft: 1,
  },
  {
    icon: 'FullWidth',
    label: '""',
    keyword: '“”',
    value: `""`,
    goLeft: 1,
  },
  {
    icon: 'FullWidth',
    label: '“”',
    keyword: '“”',
    value: `”“`,
    goLeft: 1,
  },
];
/*
 * 除开系统联想候选表的其他所有表之和
 */
const OtherSuggestList = HalfWidthSuggestList.concat(MoreSuggestList);
export function allSuggestList(keyword, locales) {
  const systemSuggestList = [].concat(SystemSuggestList);
  const otherSuggestList = [].concat(OtherSuggestList);
  systemSuggestList.forEach((item) => {
    item.label = locales ? locales[item.label] : item.label;
  });
  otherSuggestList.forEach((item) => {
    item.label = locales ? locales[item.label] : item.label;
  });
  if (keyword[0] === '/' || keyword[0] === '、' || addonsKeywords.includes(keyword[0])) {
    systemSuggestList.forEach((item) => {
      item.keyword = ''.concat(keyword[0], item.keyword);
    });
  }
  // '、'除了返回系统候选表，还需要返回两个半角字符
  return otherSuggestList.concat(systemSuggestList).filter((item) => {
    return item.keyword.startsWith(keyword[0]);
  });
}
