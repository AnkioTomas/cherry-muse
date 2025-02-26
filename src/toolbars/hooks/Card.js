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
/**
 * 插入面板
 */
export default class Card extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('card', 'credit_card');
    this.subMenuConfig = [
      {
        name: 'normalCard',
        iconName: 'card_membership',
        onclick: this.bindSubClick.bind(
          this,
          `
#list
![](图片)[标题](链接) 描述
`,
        ),
      },
      {
        name: 'noImageCard',
        iconName: 'space_dashboard',
        onclick: this.bindSubClick.bind(
          this,
          `
#list/1
[标题](链接) 描述
`,
        ),
      },
      {
        name: 'imageCard',
        iconName: 'badge',
        onclick: this.bindSubClick.bind(
          this,
          `
#image/3
![标题](图片)[查看详情](链接) 描述内容
`,
        ),
      },
    ];
  }

  onClick(selection, shortKey) {
    return `\`\`\`card${shortKey}\`\`\`\n`;
  }
}
