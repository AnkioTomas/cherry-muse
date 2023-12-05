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
import Event from '@/Event';
import { deflate } from 'pako';

const DEFAULT_OPTIONS = {
  theme: 'default',
  altFontFamily: 'sans-serif',
  fontFamily: 'sans-serif',
  themeCSS: '.label foreignObject { font-size: 90%; overflow: visible; } .label { font-family: sans-serif; }',
  flowchart: {
    useMaxWidth: false,
  },
  sequence: {
    useMaxWidth: false,
  },
  startOnLoad: false,
  logLevel: 5,
};

export default class MermaidCodeEngine {
  static TYPE = 'figure';

  static install(cherryOptions, ...args) {
    mergeWith(cherryOptions, {
      engine: {
        syntax: {
          codeBlock: {
            customRenderer: {
              mermaid: new MermaidCodeEngine(...args),
            },
          },
        },
      },
    });
  }

  mermaidAPIRefs = null;
  options = DEFAULT_OPTIONS;
  dom = null;
  mermaidCanvas = null;

  constructor(mermaidOptions = {}) {
    const { mermaid, apiHost = 'https://mermaid.ink' } = mermaidOptions;
    this.api = !mermaid && !window.mermaid;
    this.apiHost = apiHost;
    this.options = { ...DEFAULT_OPTIONS, ...(mermaidOptions || {}) };

    this.mermaidAPIRefs = mermaid || window.mermaid;
    this.mermaidAPIRefs.initialize(this.options);
    const that = this;
    Event.on('previewer', 'beforeRenderDom', function ([sign, dom]) {});
    Event.on('previewer', 'afterRenderDom', function ([sign, dom]) {
      if (that.api) return;
      const mermaidClazz = `mermaid-${sign}`;
      const item = sessionStorage.getItem(mermaidClazz);
      if (!item) return;
      const mermaidCanvas = document.querySelectorAll(`.${mermaidClazz}`);
      if (!mermaidCanvas) {
        return;
      }
      for (const mermaidCanva of mermaidCanvas) {
        const id = mermaidClazz + Math.floor(1000 + Math.random() * 9000);
        that.mermaidAPIRefs.render(id, item).then(function (svg) {
          mermaidCanva.innerHTML = svg.svg;
        });
      }
      sessionStorage.removeItem(mermaidClazz);
    });
  }

  fromUint8Array(u8a) {
    const fromCC = String.fromCharCode.bind(String);
    const maxargs = 0x1000;
    const strs = [];
    for (let i = 0, l = u8a.length; i < l; i += maxargs) {
      // eslint-disable-next-line prefer-spread
      strs.push(fromCC.apply(null, u8a.subarray(i, i + maxargs)));
    }
    return btoa(strs.join(''));
  }
  renderFromApi(src) {
    const convert = {
      code: src,
      mermaid: '',
      updateDiagram: false,
      autoSync: false,
      editorMode: {},
      panZoom: false,
      pan: { x: 100, y: 100 },
      zoom: 100,
      loader: {},
    };
    const data = new TextEncoder().encode(JSON.stringify(convert));
    const compressed = deflate(data, { level: 9 });
    const image = this.fromUint8Array(compressed);
    return `<img src="${this.apiHost}/img/pako:${encodeURIComponent(image)}" style="max-width: 100%"  alt=""/>`;
  }
  render(src, sign, $engine, config = {}) {
    let $sign = sign;
    if (!$sign) {
      $sign = Math.round(Math.random() * 100000000);
    }
    if (this.api) return this.renderFromApi(src);
    const graphId = `mermaid-${$sign}`;
    sessionStorage.setItem(graphId, src);
    return `<div class="mermaid ${graphId}" style="text-align: center"></div>`;
  }
}
