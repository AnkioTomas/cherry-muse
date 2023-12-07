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
          count: 3,
          type: 'card',
          data: [
            {
              name: '麋鹿鲁哟',
              desc: '大道至简，知易行难',
              avatar: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200122153807.jpg',
              link: 'https://www.cnblogs.com/miluluyo/',
              bgColor: '#CBEAFA',
              textColor: '#6854A1',
            },
            {
              name: 'XAOXUU',
              desc: '#IOS #Volantis主题作者',
              avatar: 'https://jsd.cdn.zzko.cn/gh/xaoxuu/assets@master/avatar/avatar.png',
              link: 'https://xaoxuu.com',
              bgColor: '#718971',
              textColor: '#fff',
            },
            {
              name: '平凡的你我',
              desc: '理想成为大牛的小陈同学',
              avatar: 'https://reinness.com/avatar.png',
              link: 'https://reinness.com',
              bgColor: '#FCDBA0',
              textColor: '#A05F2C',
            },
          ],
        }),
      },
      {
        name: 'noImageCard',
        iconName: 'space_dashboard',
        onclick: this.bindSubClick.bind(this, {
          count: 2,
          type: 'card',
          data: [
            {
              name: '《静夜思》',
              desc: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
              bgColor: '#F0DFB1',
              textColor: '#242A38',
            },
            {
              name: 'Vdoing',
              desc: '🚀一款简洁高效的VuePress 知识管理&博客(blog) 主题',
              link: 'https://github.com/xugaoyi/vuepress-theme-vdoing',
              bgColor: '#DFEEE7',
              textColor: '#2A3344',
            },
          ],
        }),
      },
      {
        name: 'imageCard',
        iconName: 'badge',
        onclick: this.bindSubClick.bind(this, {
          count: 3,
          type: 'cardImage',
          data: [
            {
              img: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200529162253.jpg',
              link: 'https://xugaoyi.com/',
              name: '标题',
              desc: '描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容',
              author: 'Evan Xu',
              avatar: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200103123203.jpg',
            },
            {
              img: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200530100256.jpg',
              link: 'https://xugaoyi.com/',
              name: '标题',
              desc: '描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容',
              author: 'Evan Xu',
              avatar: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200103123203.jpg',
            },
            {
              img: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200530100257.jpg',
              link: 'https://xugaoyi.com/',
              name: '标题',
              desc: '描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容',
              author: 'Evan Xu',
              avatar: 'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200103123203.jpg',
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
