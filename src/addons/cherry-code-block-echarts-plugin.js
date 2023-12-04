// @ts-nocheck
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
import mergeWith from 'lodash/mergeWith';
import Event from '../Event';
import extraJSON from '@/utils/jsonUtils';
export default class EChartsCodeEngine {
  static install(cherryOptions, args) {
    mergeWith(cherryOptions, {
      engine: {
        syntax: {
          codeBlock: {
            customRenderer: {
              echarts: new EChartsCodeEngine({
                ...args,
                ...(cherryOptions.engine.syntax.echarts ?? {}),
              }),
            },
          },
        },
      },
    });
  }

  constructor(echartsOptions = {}) {
    const { echarts } = echartsOptions;
    if (!echarts && !window.echarts) {
      throw new Error('code-block-echarts-plugin[init]: Package echarts  not found.');
    }
    this.echartsInstanceRef = echarts || window.echarts;
    const that = this;
    Event.on('previewer', 'beforeRenderDom', function ([sign, dom]) {
      const chartClazz = `echarts-${sign}`;
      const echartsCanvas = dom.querySelectorAll(`.${chartClazz}`);
      if (echartsCanvas) {
        for (const echartsCanva of echartsCanvas) {
          const echart = that.echartsInstanceRef.getInstanceByDom(echartsCanva);
          if (echart) {
            sessionStorage.setItem('chartWidth', echart.getWidth());
            sessionStorage.setItem('chartHeight', echart.getHeight());
            echart.dispose();
            sessionStorage.removeItem(chartClazz);
          }
        }
      }
    });
    Event.on('previewer', 'afterRenderDom', function ([sign, dom]) {
      const chartClazz = `echarts-${sign}`;
      const item = sessionStorage.getItem(chartClazz);
      if (!item) return;
      const json = JSON.parse(item);
      const echartsCanvas = document.querySelectorAll(`.${chartClazz}`);
      if (!echartsCanvas) {
        return;
      }
      for (const echartsCanva of echartsCanvas) {
        let myChart = that.echartsInstanceRef.getInstanceByDom(echartsCanva);
        if (!myChart) {
          myChart = that.echartsInstanceRef.init(
            echartsCanva,
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '',
            {
              renderer: 'svg',
            },
          );
        }
        myChart.setOption(json);
      }

      //  Event.off('previewer', 'afterRenderDom', afterRender);
    });

    function renderChart(isDark) {
      const query = document.querySelectorAll('.echart-container');
      if (!query) {
        return;
      }
      for (const queryElement of query) {
        const item = sessionStorage.getItem(queryElement.dataset.json);
        if (!item) continue;
        const json = JSON.parse(item);
        let myChart = that.echartsInstanceRef.getInstanceByDom(queryElement);
        if (myChart) {
          myChart.dispose();
        }
        myChart = that.echartsInstanceRef.init(queryElement, isDark ? 'dark' : '', {
          renderer: 'svg',
        });
        myChart.setOption(json);
      }
    }

    window.addEventListener('resize', function () {
      const query = document.querySelectorAll('.echart-container');
      if (!query) {
        return;
      }
      for (const queryElement of query) {
        const myChart = that.echartsInstanceRef.getInstanceByDom(queryElement);
        if (myChart) {
          myChart.resize();
        }
      }
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      renderChart(e.matches);
    });
  }

  render(src, sign, $engine, config = {}) {
    let $sign = sign;
    if (!$sign) {
      $sign = Math.round(Math.random() * 100000000);
    }
    const graphId = `echarts-${$sign}`;

    const json = extraJSON(src);

    if (json === {}) {
      return ``;
    }

    sessionStorage.setItem(graphId, JSON.stringify(json));
    return `<div class="${graphId} echart-container" data-json="${graphId}"  style="height: 400px;width: 100%"></div>`;
  }
}
