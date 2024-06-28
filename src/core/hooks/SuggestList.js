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
];
