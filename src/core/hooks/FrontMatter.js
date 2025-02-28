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
import ParagraphBase from '@/core/ParagraphBase';
import { compileRegExp } from '@/utils/regexp';
import jsYaml from 'js-yaml';

export default class FrontMatter extends ParagraphBase {
  static HOOK_NAME = 'frontMatter';

  constructor(options) {
    super({ needCache: true });
  }

  beforeMakeHtml(str) {
    return str.replace(this.RULE.reg, (match, content) => {
      try {
        this.$engine.$cherry.frontMatter = jsYaml.load(content);
      } catch (e) {
        try {
          this.$engine.$cherry.frontMatter = JSON.parse(e.toString());
        } catch (e) {
          this.$engine.$cherry.frontMatter = {};
        }
      }
      console.log(this.$engine.$cherry.frontMatter);
      return '';
    });
  }

  makeHtml(str, sentenceMakeFunc) {
    // fontMatter不渲染，作为全局属性出现。
    return str;
  }

  rule() {
    const ret = { begin: '^\\s*-{3,}[^\\n]*\\n', end: '\\n-{3,}[^\\n]*\\n', content: '([\\s\\S]+?)' };
    ret.reg = compileRegExp(ret, 'g', true);
    return ret;
  }
}
