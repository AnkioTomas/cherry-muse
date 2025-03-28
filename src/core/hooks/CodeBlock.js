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
import Prism from 'prismjs';
import { escapeHTMLSpecialChar } from '@/utils/sanitize';
import { getTableRule, getCodeBlockRule } from '@/utils/regexp';
import { prependLineFeedForParagraph } from '@/utils/lineFeed';

Prism.manual = true;

const CUSTOM_WRAPPER = {
  figure: 'figure',
};

export const supportLanguages = [
  'markup',
  'html',
  'xml',
  'svg',
  'mathml',
  'ssml',
  'atom',
  'rss',
  'css',
  'clike',
  'javascript',
  'js',
  'abap',
  'abnf',
  'actionscript',
  'ada',
  'agda',
  'al',
  'antlr4',
  'g4',
  'apacheconf',
  'apex',
  'apl',
  'applescript',
  'aql',
  'arduino',
  'ino',
  'arff',
  'armasm',
  'arm-asm',
  'arturo',
  'art',
  'asciidoc',
  'adoc',
  'aspnet',
  'asm6502',
  'asmatmel',
  'autohotkey',
  'autoit',
  'avisynth',
  'avs',
  'avro-idl',
  'avdl',
  'awk',
  'gawk',
  'bash',
  'sh',
  'shell',
  'basic',
  'batch',
  'bbcode',
  'shortcode',
  'bbj',
  'bicep',
  'birb',
  'bison',
  'bnf',
  'rbnf',
  'bqn',
  'brainfuck',
  'brightscript',
  'bro',
  'bsl',
  'oscript',
  'c',
  'csharp',
  'cs',
  'dotnet',
  'cpp',
  'cfscript',
  'cfc',
  'chaiscript',
  'cil',
  'cilkc',
  'cilk-c',
  'cilkcpp',
  'cilk-cpp',
  'cilk',
  'clojure',
  'cmake',
  'cobol',
  'coffeescript',
  'coffee',
  'concurnas',
  'conc',
  'csp',
  'cooklang',
  'coq',
  'crystal',
  'css-extras',
  'csv',
  'cue',
  'cypher',
  'd',
  'dart',
  'dataweave',
  'dax',
  'dhall',
  'diff',
  'django',
  'jinja2',
  'dns-zone-file',
  'dns-zone',
  'docker',
  'dockerfile',
  'dot',
  'gv',
  'ebnf',
  'editorconfig',
  'eiffel',
  'ejs',
  'eta',
  'elixir',
  'elm',
  'etlua',
  'erb',
  'erlang',
  'excel-formula',
  'xlsx',
  'xls',
  'fsharp',
  'factor',
  'false',
  'firestore-security-rules',
  'flow',
  'fortran',
  'ftl',
  'gml',
  'gamemakerlanguage',
  'gap',
  'gcode',
  'gdscript',
  'gedcom',
  'gettext',
  'po',
  'gherkin',
  'git',
  'glsl',
  'gn',
  'gni',
  'linker-script',
  'ld',
  'go',
  'go-module',
  'go-mod',
  'gradle',
  'graphql',
  'groovy',
  'haml',
  'handlebars',
  'hbs',
  'mustache',
  'haskell',
  'hs',
  'haxe',
  'hcl',
  'hlsl',
  'hoon',
  'http',
  'hpkp',
  'hsts',
  'ichigojam',
  'icon',
  'icu-message-format',
  'idris',
  'idr',
  'ignore',
  'gitignore',
  'hgignore',
  'npmignore',
  'inform7',
  'ini',
  'io',
  'j',
  'java',
  'javadoc',
  'javadoclike',
  'javastacktrace',
  'jexl',
  'jolie',
  'jq',
  'jsdoc',
  'js-extras',
  'json',
  'webmanifest',
  'json5',
  'jsonp',
  'jsstacktrace',
  'js-templates',
  'julia',
  'keepalived',
  'keyman',
  'kotlin',
  'kt',
  'kts',
  'kumir',
  'kum',
  'kusto',
  'latex',
  'tex',
  'context',
  'latte',
  'less',
  'lilypond',
  'ly',
  'liquid',
  'lisp',
  'emacs',
  'elisp',
  'emacs-lisp',
  'livescript',
  'llvm',
  'log',
  'lolcode',
  'lua',
  'magma',
  'makefile',
  'markdown',
  'md',
  'markup-templating',
  'mata',
  'matlab',
  'maxscript',
  'mel',
  'mermaid',
  'metafont',
  'mizar',
  'mongodb',
  'monkey',
  'moonscript',
  'moon',
  'n1ql',
  'n4js',
  'n4jsd',
  'nand2tetris-hdl',
  'naniscript',
  'nani',
  'nasm',
  'neon',
  'nevod',
  'nginx',
  'nim',
  'nix',
  'nsis',
  'objectivec',
  'objc',
  'ocaml',
  'odin',
  'opencl',
  'openqasm',
  'qasm',
  'oz',
  'parigp',
  'parser',
  'pascal',
  'objectpascal',
  'pascaligo',
  'psl',
  'pcaxis',
  'px',
  'peoplecode',
  'pcode',
  'perl',
  'php',
  'phpdoc',
  'php-extras',
  'plant-uml',
  'plantuml',
  'plsql',
  'powerquery',
  'pq',
  'mscript',
  'powershell',
  'processing',
  'prolog',
  'promql',
  'properties',
  'protobuf',
  'pug',
  'puppet',
  'pure',
  'purebasic',
  'pbfasm',
  'purescript',
  'purs',
  'python',
  'py',
  'qsharp',
  'qs',
  'q',
  'qml',
  'qore',
  'r',
  'racket',
  'rkt',
  'cshtml',
  'razor',
  'jsx',
  'tsx',
  'reason',
  'regex',
  'rego',
  'renpy',
  'rpy',
  'rescript',
  'res',
  'rest',
  'rip',
  'roboconf',
  'robotframework',
  'robot',
  'ruby',
  'rb',
  'rust',
  'sas',
  'sass',
  'scss',
  'scala',
  'scheme',
  'shell-session',
  'sh-session',
  'shellsession',
  'smali',
  'smalltalk',
  'smarty',
  'sml',
  'smlnj',
  'solidity',
  'sol',
  'solution-file',
  'sln',
  'soy',
  'sparql',
  'rq',
  'splunk-spl',
  'sqf',
  'sql',
  'squirrel',
  'stan',
  'stata',
  'iecst',
  'stylus',
  'supercollider',
  'sclang',
  'swift',
  'systemd',
  't4-templating',
  't4-cs',
  't4',
  't4-vb',
  'tap',
  'tcl',
  'tt2',
  'textile',
  'toml',
  'tremor',
  'trickle',
  'troy',
  'turtle',
  'trig',
  'twig',
  'typescript',
  'ts',
  'typoscript',
  'tsconfig',
  'unrealscript',
  'uscript',
  'uc',
  'uorazor',
  'uri',
  'url',
  'v',
  'vala',
  'vbnet',
  'velocity',
  'verilog',
  'vhdl',
  'vim',
  'visual-basic',
  'vb',
  'vba',
  'warpscript',
  'wasm',
  'web-idl',
  'webidl',
  'wgsl',
  'wiki',
  'wolfram',
  'mathematica',
  'nb',
  'wl',
  'wren',
  'xeora',
  'xeoracube',
  'xml-doc',
  'xojo',
  'xquery',
  'yaml',
  'yml',
  'yang',
  'zig',
];
export default class CodeBlock extends ParagraphBase {
  static HOOK_NAME = 'codeBlock';
  static inlineCodeCache = {};

  constructor({ externals, config }) {
    super({ needCache: true });
    CodeBlock.inlineCodeCache = {};
    this.codeCache = {};
    this.customLang = [];
    this.customParser = {};
    this.wrap = config.wrap; // 超出是否换行
    this.lineNumber = config.lineNumber; // 是否显示行号
    this.copyCode = config.copyCode; // 是否显示“复制”按钮
    this.editCode = config.editCode; // 是否显示“编辑”按钮
    this.cdn = config.cdn; // 是否使用cdn
    this.expandCode = config.expandCode; // 是否支持展开代码块
    Prism.plugins.autoloader.languages_path = this.cdn;
    this.selfClosing = config.selfClosing; // 自动闭合，为true时，当md中有奇数个```时，会自动在md末尾追加一个```

    this.indentedCodeBlock = typeof config.indentedCodeBlock === 'undefined' ? true : config.indentedCodeBlock; // 是否支持缩进代码块
    this.INLINE_CODE_REGEX = /(`+)(.+?(?:\n.+?)*?)\1/g;
    if (config && config.customRenderer) {
      this.customLang = Object.keys(config.customRenderer).map((lang) => lang.toLowerCase());
      this.customParser = { ...config.customRenderer };
    }
    this.customHighlighter = config.highlighter;
  }

  $codeCache(sign, str) {
    if (sign && str) {
      this.codeCache[sign] = str;
    }

    if (this.codeCache[sign]) {
      return this.codeCache[sign];
    }

    if (this.codeCache.length > 40) {
      this.codeCache.length = 0;
    }

    return false;
  }

  // 渲染特定语言代码块
  parseCustomLanguage(lang, codeSrc, props) {
    const engine = this.customParser[lang];
    if (!engine || typeof engine.render !== 'function') {
      return false;
    }
    const html = engine.render(codeSrc, props.sign, this.$engine);
    if (!html) {
      return false;
    }
    const tag = CUSTOM_WRAPPER[engine.constructor.TYPE] || 'div';
    return `<${tag} data-sign="${props.sign}" data-type="${lang}" data-lines="${props.lines}">${html}</${tag}>`;
  }

  // 修复渲染行号时打散的标签
  fillTag(lines) {
    const tagStack = []; // 存储未闭合标签
    return lines.map((rawLine) => {
      if (!rawLine) return '';
      let line = rawLine;
      // 补全上一行未闭合标签
      while (tagStack.length) {
        const tag = tagStack.pop();
        line = `${tag}${line}`;
      }
      // 计算未闭合标签
      const tags = line.match(/<span class="(.+?)">|<\/span>/g);
      let close = 0;
      if (!tags) return line;
      while (tags.length) {
        const tag = tags.pop();
        if (/<\/span>/.test(tag)) close += 1;
        else if (!close) {
          tagStack.unshift(tag.match(/<span class="(.+?)">/)[0]);
        } else {
          close -= 1;
        }
      }
      // 补全未闭合标签
      for (let i = 0; i < tagStack.length; i++) {
        line = `${line}</span>`;
      }
      return line;
    });
  }

  // 渲染行号
  renderLineNumber(code) {
    if (!this.lineNumber) return code;
    let codeLines = code.split('\n');
    codeLines.pop(); // 末尾回车不增加行号
    codeLines = this.fillTag(codeLines);
    return `<span class="code-line">${codeLines.join('</span>\n<span class="code-line">')}</span>`;
  }

  /**
   * 判断内置转换语法是否被覆盖
   * @param {string} lang
   */
  isInternalCustomLangCovered(lang) {
    return this.customLang.indexOf(lang) !== -1;
  }

  /**
   * 预处理代码块
   * @param {string} match
   * @param {string} leadingContent
   * @param {string} code
   */
  computeLines(match, leadingContent, code) {
    const leadingSpaces = leadingContent;
    const lines = this.getLineCount(match, leadingSpaces);
    const sign = this.$engine.md5(match.replace(/^\n+/, '') + lines);
    return {
      sign,
      lines,
    };
  }

  /**
   * 包裹代码块，解决单行代码超出长度
   * @param {string} $code
   * @param {string} lang
   */
  wrapCode($code, lang) {
    return `<code class="language-${lang}${this.wrap ? ' wrap' : ''}">${$code}</code>`;
  }

  /**
   * 使用渲染引擎处理代码块
   * @param {string} $code
   * @param {string} $lang
   * @param {string} sign
   * @param {number} lines
   */
  renderCodeBlock($code, $lang, sign, lines) {
    let cacheCode = $code;
    let lang = $lang;
    const that = this;
    if (this.customHighlighter) {
      // 平台自定义代码块样式
      cacheCode = this.customHighlighter(cacheCode, lang);
    } else {
      if (!supportLanguages.includes(lang)) {
        lang = 'text';
      }

      if (Prism.languages[lang]) {
        cacheCode = Prism.highlight(cacheCode, Prism.languages[lang], lang);
        cacheCode = this.renderLineNumber(cacheCode);
      } else {
        Prism.plugins.autoloader.loadLanguages(
          [lang],
          function () {
            that.$highlightCodeBlock($code, lang, `.code-${sign}`);
          },
          function () {
            that.$highlightCodeBlock($code, 'text', `.code-${sign}`);
          },
        );
      }
    }
    const needUnExpand = this.expandCode && $code.match(/\n/g)?.length > 10; // 是否需要收起代码块
    cacheCode = `<div
        data-sign="${sign}"
        data-type="codeBlock"
        data-lines="${lines}" 
        data-edit-code="${this.editCode}" 
        data-copy-code="${this.copyCode}"
           data-expand-code="${this.expandCode}"
        data-lang="${$lang}"
         style="position:relative"
        class="code-container-${sign} ${needUnExpand ? 'cherry-code-unExpand' : 'cherry-code-expand'}"
      >
   
      <pre class="language-${lang} code-${sign}">${this.wrapCode(cacheCode, lang)}</pre>
   `;
    if (needUnExpand) {
      cacheCode += `<div class="cherry-mask-code-block">
        <div class="expand-btn">
          <span class="expand-btn material-symbols-outlined">keyboard_arrow_down</span>
        </div>
      </div>`;
    }
    cacheCode += '</div>';
    return cacheCode;
  }

  $highlightCodeBlock(code, lang, clazz) {
    const language = lang;
    let cacheCode = Prism.highlight(code, Prism.languages[language], language);
    cacheCode = this.renderLineNumber(cacheCode);
    cacheCode = this.wrapCode(cacheCode, language);
    // 查找指定id
    document.querySelectorAll(clazz).forEach((codeBlock) => {
      codeBlock.innerHTML = cacheCode;
    });
  }

  /**
   * 获取缩进代码块语法的正则
   * 缩进代码块必须要以连续两个以上的换行符开头
   */
  $getIndentedCodeReg() {
    const ret = {
      begin: '(?:^|\\n\\s*\\n)(?: {4}|\\t)',
      end: '(?=$|\\n( {0,3}[^ \\t\\n]|\\n[^ \\t\\n]))',
      content: '([\\s\\S]+?)',
    };
    return new RegExp(ret.begin + ret.content + ret.end, 'g');
  }

  /**
   * 生成缩进代码块（没有行号、没有代码高亮）
   */
  $getIndentCodeBlock(str) {
    if (!this.indentedCodeBlock) {
      return str;
    }
    return this.$recoverCodeInIndent(str).replace(this.$getIndentedCodeReg(), (match, code) => {
      const lineCount = (match.match(/\n/g) || []).length;
      const sign = this.$engine.md5(match);
      const html = `<pre data-sign="${sign}" data-lines="${lineCount}"><code>${escapeHTMLSpecialChar(
        code.replace(/\n( {4}|\t)/g, '\n'),
      )}</code></pre>`;
      // return this.getCacheWithSpace(this.pushCache(html), match, true);
      return prependLineFeedForParagraph(match, this.pushCache(html, sign, lineCount));
    });
  }

  /**
   * 预处理缩进代码块，将缩进代码块里的高亮代码块和行内代码进行占位处理
   */
  $replaceCodeInIndent(str) {
    if (!this.indentedCodeBlock) {
      return str;
    }
    return str.replace(this.$getIndentedCodeReg(), (match) => {
      return match.replace(/`/g, '~~~IndentCode');
    });
  }

  /**
   * 恢复预处理的内容
   */
  $recoverCodeInIndent(str) {
    if (!this.indentedCodeBlock) {
      return str;
    }
    return str.replace(this.$getIndentedCodeReg(), (match) => {
      return match.replace(/~~~IndentCode/g, '`');
    });
  }

  $dealUnclosingCode(str) {
    const codes = str.match(/(?:^|\n)(\n*((?:>[\t ]*)*)[^\S\n]*)(`{3,})([^`]*?)(?=$|\n)/g);
    if (!codes || codes.length <= 0) {
      return str;
    }
    // 剔除异常的数据
    let codeBegin = false;
    const $codes = codes.filter((value) => {
      if (codeBegin === false) {
        codeBegin = true;
        return true;
      }
      if (/```[^`\s]+/.test(value)) {
        return false;
      }
      codeBegin = false;
      return true;
    });
    // 如果有奇数个代码块关键字，则进行自动闭合
    if ($codes.length % 2 === 1) {
      const lastCode = $codes[$codes.length - 1].replace(/(`)[^`]+$/, '$1').replace(/\n+/, '');
      const $str = str.replace(/\n+$/, '').replace(/\n`{1,2}$/, '');
      return `${$str}\n${lastCode}\n`;
    }
    return str;
  }

  beforeMakeHtml(str, sentenceMakeFunc, markdownParams) {
    let $str = str;

    if (this.selfClosing || this.$engine.$cherry.options.engine.global.flowSessionContext) {
      $str = this.$dealUnclosingCode($str);
    }

    // 预处理缩进代码块
    $str = this.$replaceCodeInIndent($str);

    $str = $str.replace(this.RULE.reg, (match, leadingContent, leadingContentBlockQuote, begin, lang, code) => {
      function addBlockQuoteSignToResult(result) {
        if (leadingContentBlockQuote) {
          const regex = new RegExp(`^\n*`, '');
          const leadingNewline = result.match(regex)[0];
          // eslint-disable-next-line no-param-reassign
          result = leadingNewline + leadingContentBlockQuote + result.replace(regex, (_) => '');
        }
        return result;
      }
      let $code = code;
      const { sign, lines } = this.computeLines(match, leadingContent, code);
      // 从缓存中获取html
      let cacheCode = this.$codeCache(sign);
      if (cacheCode && cacheCode !== '') {
        // 别忘了把 ">"（引用块）加回来
        const result = this.getCacheWithSpace(this.pushCache(cacheCode, sign, lines), match);
        return addBlockQuoteSignToResult(result);
      }
      $code = this.$recoverCodeInIndent($code);
      $code = $code.replace(/~D/g, '$');
      $code = $code.replace(/~T/g, '~');

      /** 处理缩进 - start: 当首行反引号前存在多个空格缩进时，代码内容要相应去除相同数量的空格 */
      const indentSpaces = leadingContent?.match(/[ ]/g)?.length ?? 0;
      if (indentSpaces > 0) {
        const regex = new RegExp(`(^|\\n)[ ]{1,${indentSpaces}}`, 'g');
        $code = $code.replace(regex, '$1');
      }
      /** 处理缩进 - end */

      // 如果本代码块处于一个引用块（形如 "> " 或 "> > "）中，那么需要从代码中每一行去掉引用块的符号
      if (leadingContentBlockQuote) {
        const regex = new RegExp(`(^|\\n)${leadingContentBlockQuote}`, 'g');
        $code = $code.replace(regex, '$1');
      }

      // 未命中缓存，执行渲染
      const $lang = lang.trim();
      // 如果是公式关键字，则直接返回
      if (/^(math|katex|latex)$/i.test($lang) && !this.isInternalCustomLangCovered($lang)) {
        const prefix = match.match(/^\s*/g);
        // ~D为经编辑器中间转义后的$，code结尾包含结束```前的所有换行符，所以不需要补换行
        return `${prefix}~D~D\n${$code}~D~D`; // 提供公式语法供公式钩子解析
      }

      // 自定义语言渲染，可覆盖内置的自定义语言逻辑
      if (this.customLang.indexOf($lang.toLowerCase()) !== -1) {
        cacheCode = this.parseCustomLanguage($lang, $code, { lines, sign });
        if (cacheCode && cacheCode !== '') {
          this.$codeCache(sign, cacheCode);
          return this.getCacheWithSpace(this.pushCache(cacheCode, sign, lines), match);
        }
        // 渲染出错则按正常code进行渲染
      }
      // $code = this.$replaceSpecialChar($code);
      $code = $code.replace(/~X/g, '\\`');
      cacheCode = this.renderCodeBlock($code, $lang, sign, lines);
      cacheCode = cacheCode.replace(/\\/g, '\\\\');
      cacheCode = this.$codeCache(sign, cacheCode);
      const result = this.getCacheWithSpace(this.pushCache(cacheCode, sign, lines), match);
      return addBlockQuoteSignToResult(result);
    });
    // 表格里处理行内代码，让一个td里的行内代码语法生效，让跨td的行内代码语法失效
    $str = $str.replace(getTableRule(true), (whole, ...args) => {
      return whole
        .split('|')
        .map((oneTd) => {
          return this.makeInlineCode(oneTd);
        })
        .join('|')
        .replace(/`/g, '\\`');
    });
    // 为了避免InlineCode被HtmlBlock转义，需要在这里提前缓存
    // InlineBlock只需要在afterMakeHtml还原即可
    $str = this.makeInlineCode($str);

    // 处理缩进代码块
    $str = this.$getIndentCodeBlock($str);

    return $str;
  }

  makeInlineCode(str) {
    let $str = str;
    if (this.INLINE_CODE_REGEX.test($str)) {
      $str = $str.replace(/\\`/g, '~~not~inlineCode');
      $str = $str.replace(this.INLINE_CODE_REGEX, (match, syntax, code) => {
        if (code.trim() === '`') {
          return match;
        }
        let $code = code.replace(/~~not~inlineCode/g, '\\`');
        $code = this.$replaceSpecialChar($code);
        $code = $code.replace(/\\/g, '\\\\');
        const html = `<code>${escapeHTMLSpecialChar($code)}</code>`;
        const sign = this.$engine.md5(html);
        CodeBlock.inlineCodeCache[sign] = html;
        return `~~CODE${sign}$`;
      });
      $str = $str.replace(/~~not~inlineCode/g, '\\`');
    }
    return $str;
  }

  makeHtml(str) {
    return str;
  }

  $replaceSpecialChar(str) {
    let $str = str.replace(/~Q/g, '\\~');
    $str = $str.replace(/~Y/g, '\\!');
    $str = $str.replace(/~Z/g, '\\#');
    $str = $str.replace(/~&/g, '\\&');
    $str = $str.replace(/~K/g, '\\/');
    // $str = $str.replace(/~D/g, '$');
    // $str = $str.replace(/~T/g, '~');
    return $str;
  }

  rule() {
    return getCodeBlockRule();
  }

  mounted(dom) {
    // prettyPrint.prettyPrint();
  }
}
