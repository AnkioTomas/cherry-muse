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
        onclick: this.bindSubClick.bind(this, {
          count: 'auto',
          type: 'list',
          data: [
            {
              title: '标题',
              desc: '描述',
              image: '',
              link: '链接',
              bgColor: '',
              textColor: '',
            },
          ],
        }),
      },
      {
        name: 'noImageCard',
        iconName: 'space_dashboard',
        onclick: this.bindSubClick.bind(this, {
          count: 2,
          type: 'list',
          data: [
            {
              title: '标题',
              desc: '描述',
              link: '链接',
              bgColor: '',
              textColor: '',
            },
          ],
        }),
      },
      {
        name: 'imageCard',
        iconName: 'badge',
        onclick: this.bindSubClick.bind(this, {
          count: 3,
          type: 'image',
          data: [
            {
              img: '图片',
              link: '链接',
              title: '标题',
              desc: '描述内容',
            },
          ],
        }),
      },
    ];
  }

  onClick(selection, shortKey) {
    return `\`\`\`card\n${JSON.stringify(shortKey, null, 2)}\n\`\`\`\n`;
  }
}
