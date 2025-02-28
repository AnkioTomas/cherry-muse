import SyntaxBase from '@/core/SyntaxBase';
import { compileRegExp } from '@/utils/regexp';
import ParagraphBase from '@/core/ParagraphBase';
import md5 from 'md5';

export default class FrontMatterVars extends ParagraphBase {
  static HOOK_NAME = 'frontMatterVars';

  constructor() {
    super({ needCache: false });
  }
  beforeMakeHtml(str, sentenceMakeFunc) {
    if (!this.test(str)) {
      return str;
    }
    return str.replace(this.RULE.reg, (match, a, varName) => {
      // Custom rendering logic
      const value = this.resolveNestedVar(varName.trim());
      if (typeof value === 'undefined') {
        console.warn(`Variable ${varName} is not defined.`);
        return match; // Return the original match if the variable is not defined
      }
      const lineCount = 1;
      const sign = md5(`fontMatterVal:${varName}=${value}`);
      return `<span data-sign="${sign}" data-type="frontMatter" data-lines="${lineCount}">${value}</span>`;
    });
  }

  resolveNestedVar(varName) {
    const vars = this.$engine.$cherry.frontMatter || {};
    const levels = varName.split('.');
    let current = vars;

    for (const key of levels) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined; // Return undefined if any level is not found
      }
    }
    return current; // Return the final resolved value
  }

  rule() {
    // (?<protocol>\\w+:)\\/\\/
    const ret = {
      // ?<left>
      begin: '{{',
      content: '(\\s+)?([\\w.]+)(\\s+)?',
      // ?<right>
      end: '}}',
    };
    ret.reg = compileRegExp(ret, 'g');
    return ret;
  }
  overlayMode() {
    return {
      name: 'frontMatterVars',
      inVars: false,
      token(stream, state) {
        // Check if the stream matches the variable pattern
        if (!this.inVars && stream.match(/\{\{(\s+)?[\w.]+(\s+)?}}/)) {
          this.inVars = true;
          stream.backUp(stream.current().length);
        }
        if (this.inVars) {
          if (stream.match('{{')) {
            return 'vars-container';
          }

          if (stream.match('}}')) {
            this.inVars = false;
            return 'vars-container';
          }
          // Consume the next character if no specific match is found
          stream.next();
          return 'vars-text';
        }
        // Always advance the stream by one character if no match is found
        stream.next();
        return null;
      },
    };
  }
}
