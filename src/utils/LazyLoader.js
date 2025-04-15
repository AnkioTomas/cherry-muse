export default class LazyLoader {
  constructor(options = {}, previewer) {
    this.options = Object.assign(
      {
        loadingImgPath: '',
        maxTryTimesPerSrc: 2,
        beforeLoadCallback: (el) => {},
        afterLoadCallback: (el) => {},
        failLoadCallback: (el) => {},
        preloadHeight: 500,
        throttleTime: 500,
        lazyAttributes: ['data-src', 'data-lazy-src'],
      },
      options,
    );

    this.previewer = previewer;
    this.scrollContainer = previewer.getDomContainer();

    this.failedMap = new Map();
    this.loadedSet = new Set();
    this.observedElements = new Set();

    this.initScrollListener();
  }
  transformSrcToDataSrc(html) {
    const tagList = ['img', 'iframe', 'video', 'audio'];
    tagList.forEach((tag) => {
      const regex = new RegExp(`<${tag}([^>]*?)src="([^"]+)"([^>]*?)>`, 'g');
      html = html.replace(regex, (match, m1, src, m2) => {
        if (this.options.loadingImgPath && tag === 'img') {
          return `<${tag}${m1}src="${this.options.loadingImgPath}" data-src="${src}"${m2}>`;
        }
        return `<${tag}${m1}data-src="${src}"${m2}>`;
      });
    });
    return html;
  }
  transformLoadedDataSrcToSrc(html) {
    const tagList = ['img', 'iframe', 'video', 'audio'];
    tagList.forEach((tag) => {
      const regex = new RegExp(`<${tag}([^>]*?)data-src="([^"]+)"([^>]*?)>`, 'g');
      html = html.replace(regex, (match, m1, src, m2) => {
        if (this.loadedSet.has(src)) {
          return `<${tag}${m1}src="${src}"${m2}>`;
        }
        return match;
      });
    });
    return html;
  }
  throttle(fn, delay) {
    let timer = null;
    return function (...args) {
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  }

  initScrollListener() {
    const scrollHandler = this.throttle(this.checkElements.bind(this), this.options.throttleTime);
    this.scrollContainer.addEventListener('scroll', scrollHandler);
    this.checkElements();
  }

  getLazyAttribute(el) {
    for (const attr of this.options.lazyAttributes) {
      const value = el.getAttribute(attr);
      if (value) return { attr, value };
    }
    return null;
  }

  getTargetElements() {
    const tags = ['img', 'iframe', 'video', 'audio'];
    const elements = [];
    const containerRect = this.scrollContainer.getBoundingClientRect();
    const { preloadHeight } = this.options;

    tags.forEach((tag) => {
      const nodes = this.scrollContainer.querySelectorAll(tag);
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (
          rect.top <= containerRect.bottom + preloadHeight &&
          rect.bottom >= containerRect.top - preloadHeight &&
          this.getLazyAttribute(node)
        ) {
          elements.push(node);
        }
      });
    });

    return elements;
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const { scrollContainer } = this;
    const containerRect = scrollContainer.getBoundingClientRect();
    const { preloadHeight } = this.options;

    return (
      rect.top <= containerRect.bottom + preloadHeight &&
      rect.bottom >= containerRect.top - preloadHeight &&
      rect.left <= containerRect.right &&
      rect.right >= containerRect.left
    );
  }

  checkElements() {
    const elements = this.getTargetElements();
    elements.forEach((el) => {
      if (this.isElementInViewport(el) && !this.observedElements.has(el)) {
        this.loadElement(el);
      }
    });
  }

  loadElement(el) {
    const lazyAttr = this.getLazyAttribute(el);
    if (!lazyAttr) return;

    const src = lazyAttr.value;
    const tryCount = this.failedMap.get(src) || 0;
    if (tryCount >= this.options.maxTryTimesPerSrc) {
      this.observedElements.delete(el);
      return;
    }

    const shouldLoad = this.options.beforeLoadCallback(el);
    if (shouldLoad === false) {
      this.failedMap.set(src, tryCount + 1);
      this.options.failLoadCallback(el);
      this.observedElements.delete(el);
      return;
    }

    this.observedElements.add(el);
    this.loadResource(el, src, lazyAttr.attr);
  }

  loadResource(el, src, lazyAttr) {
    const tag = el.tagName.toLowerCase();

    const onSuccess = () => {
      el.removeAttribute(lazyAttr);
      this.loadedSet.add(src);
      this.options.afterLoadCallback(el);
      this.observedElements.delete(el);
    };

    const onError = () => {
      const retry = (this.failedMap.get(src) || 0) + 1;
      this.failedMap.set(src, retry);
      this.options.failLoadCallback(el);
      this.observedElements.delete(el);
    };

    if (tag === 'img') {
      const testImg = new Image();
      testImg.onload = () => {
        el.setAttribute('src', src);
        onSuccess();
      };
      testImg.onerror = onError;
      testImg.src = src;
    } else {
      el.setAttribute('src', src);
      if (tag === 'video' || tag === 'audio') {
        el.setAttribute('preload', 'metadata');
        el.setAttribute('controls', true);
        el.load();
        el.addEventListener('loadeddata', onSuccess);
        el.addEventListener('error', onError);
      } else {
        el.addEventListener('load', onSuccess);
        el.addEventListener('error', onError);
      }
    }
  }

  destroy() {
    this.scrollContainer.removeEventListener('scroll', this.checkElements);
    this.observedElements.clear();
    this.failedMap.clear();
    this.loadedSet.clear();
  }

  observeNewElement(el) {
    if (this.getLazyAttribute(el)) {
      this.observer.observe(el);
    }
  }
}
