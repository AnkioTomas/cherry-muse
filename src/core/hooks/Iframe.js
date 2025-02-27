import { isValidScheme } from '@/utils/sanitize';
import { prependLineFeedForParagraph } from '@/utils/lineFeed';
import SyntaxBase from '@/core/SyntaxBase';

export default class Iframe extends SyntaxBase {
  static HOOK_NAME = 'iframe';

  rule() {
    const ret = {
      begin: /^@@/m, // 严格匹配行首的@@
      content: /https?:\/\/\S+/, // 匹配到第一个空格/换行立即停止
      end: /(?=\s|$)/, // 结束条件简化为空格或行尾
    };

    ret.reg = new RegExp(
      `${ret.begin.source}\\s*` + // 允许@@后跟空格
        `(${
          // 第1捕获组：完整URL（含参数）
          ret.content.source
        })${ret.end.source}`,
      'gm', // 全局+多行模式（确保^生效）
    );
    return ret;
  }

  makeHtml(str, sentenceMakeFunc) {
    return str.replace(this.RULE.reg, (match, url) => {
      const replacedUrl = url.trim().replace(/&amp;/g, '&');
      const attrs = {
        width: '100%',
        height: '400px',
        sandbox: 'allow-scripts',
      };

      const iframe = `<iframe src="${replacedUrl}"
       
      width="${attrs.width}" 
      height="${attrs.height}"
      sandbox="${attrs.sandbox}"
   
      frameborder="0"
      loading="lazy"
      allow="fullscreen"
    ></iframe>`;
      console.warn(iframe);
      return iframe;
    });
  }

  overlayMode() {
    return {
      inIframe: false,
      name: 'iframe',
      token(stream, state) {
        // 检测@@起始标记
        if (!this.inIframe && stream.match(/^@@/)) {
          this.inIframe = true;
          return 'iframe-marker';
        }

        // 处理iframe内容区域
        if (this.inIframe) {
          // 匹配到空白字符结束
          if (stream.eatWhile(/.*?$/)) {
            this.inIframe = false;
            return 'iframe-url';
          }

          // 遇到换行符自动结束
          if (this.sol()) {
            state.inIframe = false;
          }
        }

        // 非iframe内容继续默认处理
        stream.next();
        return null;
      },
    };
  }
}
