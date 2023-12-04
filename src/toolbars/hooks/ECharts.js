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
export default class ECharts extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('echarts');
    this.noIcon = true;
    this.subMenuConfig = [
      {
        name: '基本柱状图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {},
          series: [
            {
              type: 'bar',
              data: [23, 24, 18, 25, 27, 28, 25],
            },
          ],
        }),
      },
      {
        name: '堆叠柱状图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            data: ['A', 'B', 'C', 'D', 'E'],
          },
          yAxis: {},
          series: [
            {
              data: [10, 22, 28, 43, 49],
              type: 'bar',
              stack: 'x',
            },
            {
              data: [5, 4, 3, 5, 10],
              type: 'bar',
              stack: 'x',
            },
          ],
        }),
      },
      {
        name: '基础折线图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            type: 'category',
            data: ['A', 'B', 'C'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [120, 200, 150],
              type: 'line',
            },
          ],
        }),
      },
      {
        name: '堆叠折线图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            data: ['A', 'B', 'C', 'D', 'E'],
          },
          yAxis: {},
          series: [
            {
              data: [10, 22, 28, 43, 49],
              type: 'line',
              stack: 'x',
            },
            {
              data: [5, 4, 3, 5, 10],
              type: 'line',
              stack: 'x',
            },
          ],
        }),
      },
      {
        name: '区域面积图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            data: ['A', 'B', 'C', 'D', 'E'],
          },
          yAxis: {},
          series: [
            {
              data: [10, 22, 28, 23, 19],
              type: 'line',
              areaStyle: {},
            },
            {
              data: [25, 14, 23, 35, 10],
              type: 'line',
              areaStyle: {
                color: '#ff0',
                opacity: 0.5,
              },
            },
          ],
        }),
      },
      {
        name: '平滑曲线图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            data: ['A', 'B', 'C', 'D', 'E'],
          },
          yAxis: {},
          series: [
            {
              data: [10, 22, 28, 23, 19],
              type: 'line',
              smooth: true,
            },
          ],
        }),
      },
      {
        name: '阶梯线图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Step Start',
              type: 'line',
              step: 'start',
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: 'Step Middle',
              type: 'line',
              step: 'middle',
              data: [220, 282, 201, 234, 290, 430, 410],
            },
            {
              name: 'Step End',
              type: 'line',
              step: 'end',
              data: [450, 432, 401, 454, 590, 530, 510],
            },
          ],
        }),
      },
      {
        name: '基础饼图',
        onclick: this.bindSubClick.bind(this, {
          series: [
            {
              type: 'pie',
              data: [
                {
                  value: 335,
                  name: '直接访问',
                },
                {
                  value: 234,
                  name: '联盟广告',
                },
                {
                  value: 1548,
                  name: '搜索引擎',
                },
              ],
            },
          ],
        }),
      },
      {
        name: '圆环图',
        onclick: this.bindSubClick.bind(this, {
          title: {
            text: '圆环图的例子',
            left: 'center',
            top: 'center',
          },
          series: [
            {
              type: 'pie',
              data: [
                {
                  value: 335,
                  name: 'A',
                },
                {
                  value: 234,
                  name: 'B',
                },
                {
                  value: 1548,
                  name: 'C',
                },
              ],
              radius: ['40%', '70%'],
            },
          ],
        }),
      },
      {
        name: '玫瑰图',
        onclick: this.bindSubClick.bind(this, {
          series: [
            {
              type: 'pie',
              data: [
                {
                  value: 100,
                  name: 'A',
                },
                {
                  value: 200,
                  name: 'B',
                },
                {
                  value: 300,
                  name: 'C',
                },
                {
                  value: 400,
                  name: 'D',
                },
                {
                  value: 500,
                  name: 'E',
                },
              ],
              roseType: 'area',
            },
          ],
        }),
      },
      {
        name: '基础散点图',
        onclick: this.bindSubClick.bind(this, {
          xAxis: {
            data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          },
          yAxis: {},
          series: [
            {
              type: 'scatter',
              data: [220, 182, 191, 234, 290, 330, 310],
            },
          ],
        }),
      },
    ];
  }

  /**
   * 响应点击事件
   * @param {string} selection 被用户选中的文本内容

   * @returns {string} 回填到编辑器光标位置/选中文本区域的内容
   */
  onClick(selection, shortKey) {
    return `\`\`\`echarts\n${JSON.stringify(shortKey, null, 2)}\n\`\`\`\n`;
  }
}
