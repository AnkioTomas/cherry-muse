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
import SyntaxBase from '@/core/SyntaxBase';
import { escapeHTMLSpecialCharOnce as $e, encodeURIOnce } from '@/utils/sanitize';
import imgAltHelper from '@/utils/image';
import { compileRegExp, isLookbehindSupported, NOT_ALL_WHITE_SPACES_INLINE } from '@/utils/regexp';
import { replaceLookbehind } from '@/utils/lookbehind-replace';
import UrlCache from '@/UrlCache';

const replacerFactory = function (type, match, leadingChar, alt, link, title, posterContent, config, globalConfig) {
  const refType = typeof link === 'undefined' ? 'ref' : 'url';
  let attrs = '';
  if (refType === 'ref') {
    // TODO: 全局引用
    return match;
  }

  if (refType === 'url') {
    const extent = imgAltHelper.processExtendAttributesInAlt(alt);
    let { extendStyles: style, extendClasses: classes } = imgAltHelper.processExtendStyleInAlt(alt);
    if (style) {
      style = ` style="${style}" `;
    }
    if (classes) {
      classes = ` class="${classes}" `;
    }
    attrs = title && title.trim() !== '' ? ` title="${$e(title)}"` : '';
    if (posterContent) {
      attrs += ` poster="${encodeURIOnce(posterContent)}"`;
    }

    const processedURL = globalConfig.urlProcessor(link, type);
    const defaultWrapper = `<${type} src="${UrlCache.set(
      encodeURIOnce(processedURL),
    )}"${attrs} ${extent} ${style} ${classes} controls="controls">${$e(alt || '')}</${type}>`;
    return `${leadingChar}${config.videoWrapper ? config.videoWrapper(link) : defaultWrapper}`;
  }
  // should never happen
  return match;
};

const replacerFileFactory = function (match, leadingChar, alt, link, title, posterContent, config, globalConfig) {
  const fileIcon = {
    file: 'draft', // 默认文件
    'doc|docx|txt': 'description',
    'xls|xlsx': 'table',
    'ppt|pptx': 'video_file',
    pdf: 'picture_as_pdf',
    'jpg|jpeg|png|gif|bmp|tiff|svg': 'image', // 图像文件
    'mp3|wav|aac|ogg|flac': 'audio_file', // 音频文件
    'mp4|avi|mov|wmv|flv|mkv': 'movie', // 视频文件
    'zip|rar|7z|tar.gz|gz': 'folder_zip', // 压缩文件
    'exe|dmg|msi': 'memory', // Windows 可执行文件
    'sh|json|xml|html|htm|css': 'code', // 编程语言和标记语言文件
    apk: 'apk_document', // APK 文件
  };

  function getIcon(ext) {
    // 将 fileIcon 的键转换为数组，每个元素是该键包含的扩展名数组
    const extensionsMap = Object.entries(fileIcon).map(([key, value]) => ({
      exts: key.split('|'),
      icon: value,
    }));

    // 查找与给定扩展名匹配的图标
    const match = extensionsMap.find(({ exts }) => exts.includes(ext));

    // 如果找到匹配的图标，则返回它；否则返回默认图标
    return match ? match.icon : fileIcon.file;
  }

  const refType = typeof link === 'undefined' ? 'ref' : 'url';
  if (refType === 'ref') {
    return match;
  }
  let titleInfo = alt;
  if (!titleInfo) {
    titleInfo = 'file|file';
  }
  const titleSplit = titleInfo.split('|');
  const [name = 'file', ext = 'file', password = ''] = titleSplit;

  return ` <a href="${link}" target="_blank" class="cherry-file">
        <div class="cherry-file-icon">
           <span class="material-symbols-outlined">${getIcon(ext)}</span>
        </div>
        <div class="cherry-file-content">
            <h2>${name}</h2>
            ${
              password !== ''
                ? `<p class="desc" ><span class="material-symbols-outlined" style="margin-right: 5px">lock_open</span> ${password}</p>`
                : ''
            }
        </div>
    </a>
  `;
};

export default class Image extends SyntaxBase {
  static HOOK_NAME = 'image';

  constructor({ config, globalConfig }) {
    super(null);
    this.urlProcessor = globalConfig.urlProcessor;
    // TODO: URL Validator
    this.extendMedia = {
      tag: ['video', 'audio', 'file'],
      replacer: {
        video(match, leadingChar, alt, link, title, poster) {
          return replacerFactory('video', match, leadingChar, alt, link, title, poster, config, globalConfig);
        },
        audio(match, leadingChar, alt, link, title, poster) {
          return replacerFactory('audio', match, leadingChar, alt, link, title, poster, config, globalConfig);
        },
        file(match, leadingChar, alt, link, title, poster) {
          return replacerFileFactory(match, leadingChar, alt, link, title, poster, config, globalConfig);
        },
      },
    };
    this.RULE = this.rule(this.extendMedia);
  }

  toHtml(match, leadingChar, alt, link, title, ref, extendAttrs) {
    // console.log(match, alt, link, ref, title);
    const refType = typeof link === 'undefined' ? 'ref' : 'url';
    let attrs = '';
    if (refType === 'ref') {
      // 全局引用，理应在CommentReference中被替换，没有被替换说明没有定义引用项
      return match;
    }
    if (refType === 'url') {
      const extent = imgAltHelper.processExtendAttributesInAlt(alt);
      let { extendStyles: style, extendClasses: classes } = imgAltHelper.processExtendStyleInAlt(alt);
      if (style) {
        style = ` style="${style}" `;
      }
      if (classes) {
        classes = ` class="${classes}" `;
      }
      attrs = title && title.trim() !== '' ? ` title="${$e(title.replace(/["']/g, ''))}"` : '';
      let srcProp = 'src';
      let srcValue;
      const cherryOptions = this.$engine.$cherry.options;
      if (cherryOptions.callback && cherryOptions.callback.beforeImageMounted) {
        const imgAttrs = cherryOptions.callback.beforeImageMounted(srcProp, link);
        srcProp = imgAttrs.srcProp || srcProp;
        srcValue = imgAttrs.src || link;
      }
      const extendAttrStr = extendAttrs
        ? extendAttrs
            .replace(/[{}]/g, '')
            .replace(/([^=\s]+)=([^\s]+)/g, '$1="$2"')
            .replace(/&/g, '&amp;') // 对&多做一次转义，cherry现有的机制会自动把&amp;转成&，只有多做一次转义才能抵消cherry的机制
        : '';
      return `${leadingChar}<img ${srcProp}="${UrlCache.set(
        encodeURIOnce(this.urlProcessor(srcValue, 'image')),
      )}" ${extent} ${style} ${classes} alt="${$e(alt || '')}"${attrs} ${extendAttrStr}/>`;
    }
    // should never happen
    return match;
  }

  toMediaHtml(match, leadingChar, mediaType, alt, link, title, ref, posterWrap, poster, ...args) {
    if (!this.extendMedia.replacer[mediaType]) {
      return match;
    }
    return this.extendMedia.replacer[mediaType].call(this, match, leadingChar, alt, link, title, poster, ...args);
  }

  makeHtml(str) {
    let $str = str;
    if (this.test($str)) {
      if (isLookbehindSupported()) {
        $str = $str.replace(this.RULE.reg, this.toHtml.bind(this));
      } else {
        $str = replaceLookbehind($str, this.RULE.reg, this.toHtml.bind(this), true, 1);
      }
    }
    if (this.testMedia($str)) {
      if (isLookbehindSupported()) {
        $str = $str.replace(this.RULE.regExtend, this.toMediaHtml.bind(this));
      } else {
        $str = replaceLookbehind($str, this.RULE.regExtend, this.toMediaHtml.bind(this), true, 1);
      }
    }
    return $str;
  }

  // afterMakeHtml(str) {
  //   return UrlCache.restoreAll(str);
  // }

  testMedia(str) {
    return this.RULE.regExtend && this.RULE.regExtend.test(str);
  }

  rule(extendMedia) {
    const ret = {
      // lookbehind启用分组是为了和不兼容lookbehind的场景共用一个回调
      begin: isLookbehindSupported() ? '((?<!\\\\))!' : '(^|[^\\\\])!',
      content: [
        '\\[([^\\n]*?)\\]', // ?<alt>
        '[ \\t]*', // any spaces
        `${
          '(?:' +
          '\\(' +
          '([^"][^\\s]+?)' + // ?<link> url
          '(?:[ \\t]((?:".*?")|(?:\'.*?\')))?' + // ?<title> optional
          '\\)' +
          '|' + // or
          '\\[('
        }${NOT_ALL_WHITE_SPACES_INLINE})\\]` + // ?<ref> global ref
          ')',
      ].join(''),
      end: '({[^{}]+?})?', // extend attrs e.g. {width=50 height=60}
    };
    if (extendMedia) {
      const extend = { ...ret };
      // TODO: 支持Lookbehind
      extend.begin = isLookbehindSupported()
        ? `((?<!\\\\))!(${extendMedia.tag.join('|')})`
        : `(^|[^\\\\])!(${extendMedia.tag.join('|')})`;
      extend.end = '({poster=(.*)})?';
      ret.regExtend = compileRegExp(extend, 'g');
    }
    ret.reg = compileRegExp(ret, 'g');
    return ret;
  }
  overlayMode() {
    return {
      inImageContainer: false,
      name: 'panel',
      token(stream, state) {
        // 检查行的开头是否有 ':::'
        if (stream.sol() && stream.match('!')) {
          this.inImageContainer = stream.peek() !== null;
          return null;
        }

        if (this.inImageContainer && stream.match(/(video|audio|file)?/)) {
          this.inImageContainer = false;
          if (stream.peek() === '[') {
            return 'image-type';
          }
        }

        if (!stream.sol() && stream.match('#') && stream.peek() !== '#' && stream.peek() !== ' ') {
          return 'image-split';
        }
        if (stream.match('|')) {
          return 'image-split-v2';
        }

        this.inImageContainer = false;
        stream.next(); // 前进到下一个字符
        return null; // 默认返回 null
      },
    };
  }
}
