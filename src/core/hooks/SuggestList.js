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
import { supportLanguages } from '@/core/hooks/CodeBlock';
import { expandList } from '@/core/hooks/Suggester';

const Brackets = [
  {
    key: '[ ]',
    value: `[]`,
    goLeft: 1,
  },
  {
    key: '{ }',
    value: `{}`,
    goLeft: 1,
  },
  {
    key: '【 】',
    value: `[]`,
    goLeft: 1,
  },
  {
    key: '『  』',
    value: `『』`,
    goLeft: 1,
  },
  {
    key: '「  」',
    value: `「」`,
    goLeft: 1,
  },
];
/**
 *
 * @param {Suggester} suggester
 * @returns
 * */
export const systemSuggests = [
  {
    keyword: ':',
    data(keywords, callback, $cherry, key) {
      if (!keywords.startsWith('::')) {
        // 面板语法提示
        callback(fuzzySearchKeysWithValues(keywords, $cherry.options.engine.syntax.emoji));
        return;
      }
      const list = expandList($cherry, [
        {
          toolbar: 'panel',
          keyword: '',
        },
      ]);
      const result = [];
      const keyword = keywords.replace('::', '').trim();
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const itemKey = item.keyword.replace('panel', '').toLowerCase().trim();
        if (itemKey.startsWith(keyword)) {
          item.goTop = 2;
          result.push(item);
        }
      }
      if (result.length > 0) {
        callback(result);
      }
    },
  },
  {
    keyword: '`', // 代码块
    data(keywords, callback, $cherry, key) {
      const startKey = '```';
      const keyLength = startKey.length;
      const totalKey = key + keywords;
      if (totalKey.startsWith(startKey)) {
        const languages = [];
        const word = totalKey.substring(keyLength).trim();
        for (let i = 0; i < supportLanguages.length; i++) {
          const language = supportLanguages[i];
          if (language === 'mermaid') continue;
          if (language.startsWith(word)) {
            languages.push({
              key: language,
              value: `\`\`\`${language}
              
\`\`\`
`,
              goTop: 2,
            });
          }
        }
        if (languages.length > 0) {
          callback(languages);
        } else {
          for (const string of ['card', 'echarts', 'mermaid']) {
            if (string.startsWith(word)) {
              const list = expandList($cherry, [
                {
                  toolbar: string === 'mermaid' ? 'graph' : string,
                  keyword: '',
                  goTop: 2,
                },
              ]);
              callback(list);
            }
          }
        }
      } else {
        callback([
          {
            icon: 'code',
            key: 'codeBlock',
            keyword: '``',
            value: `\`\`\`

\`\`\`
`,
            goTop: 2,
          },

          {
            key: 'code',
            icon: 'code',
            keyword: '`',
            value: `\`\``,
            goLeft: 1,
          },
        ]);
      }
    },
  },
  {
    keyword: '[【',
    data(keywords, callback, $cherry, key) {
      const result = [];
      let startKey = '[';
      if (keywords.startsWith(startKey)) {
        const list = expandList($cherry, [
          {
            toolbar: 'badge',
            keyword: '',
          },
        ]);
        const keyword = keywords.replace(startKey, '').trim();
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const itemKey = item.keyword.replace('badge', '').toLowerCase().trim();
          if (itemKey.startsWith(keyword)) {
            switch (itemKey) {
              case 'important':
                item.goLeft = 19;
                break;
              case 'info':
                item.goLeft = 14;
                break;
              case 'warning':
                item.goLeft = 17;
                break;
              case 'danger':
                item.goLeft = 16;
                break;
              case 'tip':
                item.goLeft = 13;
                break;
              case 'top':
                item.goLeft = 11;
                break;
              case 'center':
                item.goLeft = 14;
                break;
              case 'bottom':
                item.goLeft = 14;
                break;
            }

            result.push(item);
          }
        }
        if ('toc'.startsWith(keyword)) {
          result.push({
            icon: 'toc',
            key: 'toc',
            keyword: 'toc',
            value: `[[TOC]]\n`,
            goLeft: 0,
          });
        }
        if (result.length > 0) {
          callback(result);
        }
        return;
      }
      startKey = '^';
      if (keywords.startsWith(startKey)) {
        callback([
          {
            icon: 'edit_note',
            key: 'footNoteTitle',
            keyword: '……^',
            value: `[^脚注标题]`,
            goLeft: 5,
          },
          {
            icon: 'text_snippet',
            key: 'footNoteText',
            keyword: '……^',
            value: `[^脚注标题]: 脚注内容`,
            goLeft: 11,
          },
        ]);
        return;
      }
      const list = expandList($cherry, [
        {
          toolbar: 'link',
          keyword: '',
        },
      ]);
      callback(list.concat(Brackets));
    },
  },
  {
    keyword: '+',
    data(keywords, callback, $cherry, key) {
      const result = [];
      const list = [
        {
          icon: 'more_horiz',
          key: 'detailOpen',
          keyword: '+',
          value: `++ 标题\n内容\n+++\n`,
          goTop: 2,
        },
        {
          icon: 'more_horiz',
          key: 'detailClose',
          keyword: '-',
          value: `++- 标题\n内容\n+++\n`,
          goTop: 2,
        },
      ];

      for (const listElement of list) {
        if (listElement.keyword.startsWith(keywords) || keywords === '') {
          result.push(listElement);
        }
      }

      callback(result);
    },
  },
  {
    keyword: '!',
    data(keywords, callback, $cherry, key) {
      const result = [];
      const list = [
        {
          icon: 'image',
          key: 'image',
          keyword: '[',
          value: `![描述#center](链接)`,
          goLeft: 14,
        },
        {
          icon: 'videocam',
          key: 'video',
          keyword: 'video',
          value: `!video[描述](链接){poster=封面链接}`,
          goLeft: 20,
        },
        {
          icon: 'mic',
          key: 'audio',
          keyword: 'audio',
          value: `!audio[描述](链接)`,
          goLeft: 7,
        },
        {
          icon: 'attach_file',
          key: 'file',
          keyword: 'file',
          value: `!file[名称|拓展名|密码](链接)`,
          goLeft: 14,
        },
      ];

      for (const listElement of list) {
        if (listElement.keyword.startsWith(keywords) || keywords === '') {
          result.push(listElement);
        }
      }

      callback(result);
    },
  },
];
