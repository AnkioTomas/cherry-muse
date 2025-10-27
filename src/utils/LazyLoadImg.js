/**
 * Copyright (C) 2021 Tencent.
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

/**
 * 懒加载媒体资源（图片、视频、音频、iframe）
 *
 * - 只缓存资源的src的原因
 *    - 1、因为浏览器的缓存机制，相同的src第二次请求时，浏览器会直接返回缓存的资源
 *    - 2、编辑状态时预览区域dom结构不稳定，并不能准确的缓存到元素dom对象
 *
 * - 当浏览器**禁用**了缓存时，本机制效果有限
 *    - 依然还是可以实现懒加载的效果
 *    - 但是会把资源请求次数翻倍
 */
export default class LazyLoadImg {
  options = {
    // 加载图片时如果需要展示loading图，则配置loading图的地址
    loadingImgPath: '',
    // 同一时间最多有几个资源请求，最大同时加载6个资源
    maxNumPerTime: 2,
    // 不进行懒加载处理的资源数量，如果为0，即所有资源都进行懒加载处理， 如果设置为-1，则所有资源都不进行懒加载处理
    noLoadImgNum: 5,
    // 首次自动加载几个资源（不论资源是否滚动到视野内），autoLoadImgNum = -1 表示会自动加载完所有资源
    autoLoadImgNum: 5,
    // 针对加载失败的资源 或 beforeLoadOneImgCallback 返回false 的资源，最多尝试加载几次，为了防止死循环，最多5次。以资源的src为纬度统计重试次数
    maxTryTimesPerSrc: 2,
    // 加载一个资源之前的回调函数，函数return false 会终止加载操作
    beforeLoadOneImgCallback: (element) => {},
    // 加载一个资源失败之后的回调函数
    failLoadOneImgCallback: (element) => {},
    // 加载一个资源之后的回调函数，如果资源加载失败，则不会回调该函数
    afterLoadOneImgCallback: (element) => {},
    // 加载完所有资源后调用的回调函数，只表示某一个时刻所有资源都加在完时的回调，如果预览区域又有了新资源，当新资源加载完后还会产生这个回调
    afterLoadAllImgCallback: () => {},
  };

  constructor(options, previewer) {
    Object.assign(this.options, options);
    this.previewer = previewer;
    // 记录已经加载过的资源src
    this.srcLoadedList = [];
    // 记录加载失败的资源src，key是src，value是失败次数
    this.srcFailLoadedList = {};
    // 记录正在加载的资源src
    this.srcLoadingList = [];
    // 记录所有懒加载的资源src
    this.srcList = [];
    // 记录当前时刻有多少资源正在加载
    this.loadingImgNum = 0;
    // 记录上次加载完所有资源的个数
    this.lastLoadAllNum = 0;
    this.previewerDom = this.previewer.getDomContainer();
  }

  /**
   * 判断图片的src是否加载过
   * @param {String} src
   * @return {Boolean}
   */
  isLoaded(src) {
    return this.srcLoadedList.includes(src);
  }

  /**
   * 判断图片是否正在加载
   * @param {String} src
   * @return {Boolean}
   */
  isLoading(src) {
    return this.srcLoadingList.includes(src);
  }

  /**
   * 加载失败时，把src加入到失败队列中，并记录失败次数
   * @param {*} src
   */
  loadFailed(src) {
    this.srcFailLoadedList[src] = this.srcFailLoadedList[src] ? this.srcFailLoadedList[src] + 1 : 1;
  }

  /**
   * 判断图片失败次数是否超过最大次数
   * @param {*} src
   * @return {Boolean}
   */
  isFailLoadedMax(src) {
    return this.srcFailLoadedList[src] && this.srcFailLoadedList[src] > this.options.maxTryTimesPerSrc;
  }

  /**
   * 判断当前时刻所有资源是否都完成过加载
   * 当出现新资源后，完成加载后，当前函数还是会再次触发加载完的回调函数（afterLoadAllImgCallback）
   * 该函数并不是实时返回的，最大有1s的延时
   */
  isLoadedAllDone() {
    const elements = this.previewerDom.querySelectorAll('img[data-src], video[data-src], audio[data-src], iframe[data-src]');
    const allLoadedNum = this.srcLoadedList.length;
    // const dataSrcRemain = allLoadNum - this.srcLoadedList.length;
    if (elements.length <= 0 && this.lastLoadAllNum < allLoadedNum) {
      this.lastLoadAllNum = allLoadedNum;
      this.options.afterLoadAllImgCallback();
      return true;
    }
    return false;
  }

  /**
   * 当向下滚动时，提前100px加载资源
   * 当向上滚动时，不提前加载资源，一定要资源完全进入可视区域（top > 0）再加载资源，否则当锚点定位时，会由于上面的资源加载出现定位不准的情况
   *
   */
  loadOneImg() {
    const elements = this.previewerDom.querySelectorAll('img[data-src], video[data-src], audio[data-src], iframe[data-src]');
    const { height, top } = this.previewerDom.getBoundingClientRect();
    const previewerHeight = height + top + 100; // 冗余一定高度用于提前加载
    const windowsHeight = window?.innerHeight ?? 0 + 100; // 浏览器的视口高度
    const maxHeight = Math.min(previewerHeight, windowsHeight); // 目标视区高度一定是小于浏览器视口高度的，也一定是小于预览区高度的
    const minHeight = top - 30; // 计算顶部高度时，需要预加载一行高
    const { autoLoadImgNum } = this.options;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const position = element.getBoundingClientRect();
      // 判断是否在视区内
      const testPosition = position.top >= minHeight && position.top <= maxHeight;
      // 判断是否需要自动加载
      const testAutoLoad = this.srcList.length < autoLoadImgNum;
      if (!testPosition && !testAutoLoad) {
        continue;
      }
      let originSrc = element.getAttribute('data-src');
      if (!originSrc) {
        continue;
      }
      if (this.isLoaded(originSrc) || this.isFailLoadedMax(originSrc)) {
        // 如果已经加载过相同的资源，或者已经超过失败最大重试次数，则直接加载
        element.setAttribute('src', originSrc);
        element.removeAttribute('data-src');
      }
      // 如果当前src正在加载，则忽略这个src，继续找下个符合条件的src
      if (this.isLoading(originSrc)) {
        continue;
      }
      // 超过最大并发量时停止加载
      if (this.loadingImgNum >= this.options.maxNumPerTime) {
        return false;
      }
      const test = this.options.beforeLoadOneImgCallback(element);
      if (typeof test === 'undefined' || test) {
        originSrc = element.getAttribute('data-src') ?? originSrc;
      } else {
        this.loadFailed(originSrc);
        continue;
      }
      this.loadingImgNum += 1;
      this.srcList.push(originSrc);
      this.srcLoadingList.push(originSrc);
      this.tryLoadOneImg(
        element,
        originSrc,
        () => {
          element.setAttribute('src', originSrc);
          element.removeAttribute('data-src');
          this.srcLoadedList.push(originSrc);
          this.loadingImgNum -= 1;
          this.srcLoadingList.splice(this.srcLoadingList.indexOf(originSrc), 1);
          this.options.afterLoadOneImgCallback(element);
          this.loadOneImg();
        },
        () => {
          this.loadFailed(originSrc);
          this.loadingImgNum -= 1;
          this.srcLoadingList.splice(this.srcLoadingList.indexOf(originSrc), 1);
          this.options.failLoadOneImgCallback(element);
          this.loadOneImg();
        },
      );
    }
    return false;
  }

  /**
   * 尝试加载资源
   * @param {HTMLElement} element 要加载的元素
   * @param {String} src 资源地址
   * @param {Function} successCallback 成功回调
   * @param {Function} failCallback 失败回调
   */
  tryLoadOneImg(element, src, successCallback, failCallback) {
    const tagName = element.tagName.toLowerCase();
    
    // 图片使用预加载策略
    if (tagName === 'img') {
      const img = document.createElement('img');
      img.onload = () => {
        successCallback();
        img.remove();
      };
      img.onerror = () => {
        failCallback();
        img.remove();
      };
      img.setAttribute('src', src);
      return;
    }
    
    // video/audio/iframe 不需要预加载，直接让浏览器决定何时加载
    // 直接调用成功回调，让外层设置 src 即可
    successCallback();
  }

  /**
   * 开始进行懒加载
   *
   * **关于实现方式的思考**
   * 实现媒体资源懒加载一般有三种方式：
   *  1、监听滚动事件，滚动到视野内的资源开始加载
   *  2、定时检测当前视窗内是否有资源需要加载
   *  3、当前一个资源加载完成后，自动加载下一个资源
   *
   * 方式1监听滚动事件的弊端：
   *  1、需要限频率
   *  2、不能实现自动加载所有资源的功能（autoLoadImgNum = -1）
   *  3、如果业务方对预览区域做了个性化加工，有可能导致监听不到滚动事件
   *  4、在自动滚动到锚点的场景，会在页面滚动时加载资源，资源的加载会导致锚点上方的元素高度发生变化，最终导致锚点定位失败
   *      （所以在这个场景下，需要特殊处理资源加载的时机，但并不好判断是否锚点引发的滚动）
   *  5、浏览器尺寸发生变化或者浏览器缩放比例发生变化的场景（当然还有横屏竖屏切换、系统分辨率改变等）不好监听和响应
   *
   * 方式2轮询的弊端：
   *  1、需要额外的逻辑来控制并发
   *  2、消耗计算资源，所以需要尽量优化单次计算量，并尽量避免在轮询里进行大范围dom操作
   *  3、两次资源加载中间可能有最大轮询间隔的空闲时间浪费
   *
   * 方式3依次加载的弊端：
   *  1、没办法实现滚动到视野内再加载资源
   *
   * 综合考虑决定用方式2（轮询）+方式3（依次加载）的组合方式，并且每次只做一次dom写操作
   * 轮询带来的性能开销就让受摩尔定律加持的硬件和每月都会更新版本的浏览器们愁去吧
   */
  doLazyLoad() {
    // 防止重复调用
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    const { maxNumPerTime } = this.options;
    const polling = () => {
      // 保证至少有一次自动加载
      this.loadOneImg();
      for (let i = 1; i < maxNumPerTime; i++) {
        this.loadOneImg();
      }
      setTimeout(polling, 200);
    };
    polling();
    // setTimeout(polling, 200);
    setInterval(() => {
      this.isLoadedAllDone();
    }, 1000);
  }

  /**
   * 把媒体资源里的data-src替换为src
   * @param {*} content
   * @returns {String}
   */
  changeDataSrc2Src(content) {
    return content.replace(/<(img|video|audio|iframe) ([^>]*?)data-src="([^"]+)"([^>]*?)>/g, (match, tag, m1, src, m3) => {
      return `<${tag} ${this.$removeSrc(m1)} src="${src}" ${this.$removeSrc(m3)}>`.replace(/ {2,}/g, ' ');
    });
  }

  /**
   * 把已经加载的媒体资源里的data-src替换为src
   * @param {*} content
   * @returns {String}
   */
  changeLoadedDataSrc2Src(content) {
    return content.replace(/<(img|video|audio|iframe) ([^>]*?)data-src="([^"]+)"([^>]*?)>/g, (match, tag, m1, src, m3) => {
      if (!this.isLoaded(src)) {
        return match;
      }
      return `<${tag} ${this.$removeSrc(m1)} src="${src}" ${this.$removeSrc(m3)}>`.replace(/ {2,}/g, ' ');
    });
  }

  /**
   * 移除元素的src属性
   * @param {String} element
   * @returns {String}
   */
  $removeSrc(element) {
    return ` ${element}`.replace(/^(.*?) src=".*?"(.*?$)/, '$1$2');
  }

  /**
   * 把媒体资源里的src替换为data-src，如果src已经加载过，则不替换
   * @param {String} content
   * @param {Boolean} focus 强制替换
   * @returns {String}
   */
  changeSrc2DataSrc(content, focus = false) {
    const { loadingImgPath } = this.options;
    const { noLoadImgNum } = this.options;
    let currentNoLoadImgNum = 0;
    return content.replace(/<(img|video|audio|iframe) ([^>]*?)src="([^"]+)"([^>]*?)>/g, (match, tag, m1, src, m3) => {
      // 如果已经替换过data-src了，或者没有src属性，或者关闭了懒加载功能，则不替换
      if (/data-src="/.test(match) || !/ src="/.test(match) || noLoadImgNum < 0) {
        return match;
      }
      if (focus === false) {
        // 前noLoadImgNum个资源不替换
        if (currentNoLoadImgNum < noLoadImgNum) {
          currentNoLoadImgNum += 1;
          return match;
        }
        // 如果src已经加载过，则不替换
        if (this.isLoaded(src)) {
          return match;
        }
      }
      // 如果配置了loadingImgPath且是img标签，则替换src为loadingImgPath
      if (loadingImgPath && tag === 'img') {
        return `<${tag} ${m1}src="${loadingImgPath}" data-src="${src}"${m3}>`;
      }
      return `<${tag} ${m1}data-src="${src}"${m3}>`;
    });
  }
}
