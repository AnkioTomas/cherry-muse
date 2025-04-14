import Event from '@/Event';

export default class Stats {
  constructor(options) {
    this.$cherry = options.$cherry;
    this.container = null;
    this.stats = {
      characters: 0,
      words: 0,
      paragraphs: 0,
    };
    this.init();
    this.bindEvents();
  }

  init() {
    // 创建统计信息容器
    this.container = document.createElement('div');
    this.container.className = 'cherry-editor-stats';
    const { editorDom } = this.$cherry.editor.options;
    editorDom.appendChild(this.container);
    this.update(this.$cherry.getValue());
  }

  bindEvents() {
    const cm = this.$cherry.editor.editor; // 你得确认这里能拿到 CodeMirror 实例
    cm.on('change', (instance, changeObj) => {
      const addedText = changeObj.text.join('\n');
      const removedText = (changeObj.removed || []).join('\n');

      this.incrementalUpdate(removedText, addedText);
      this.render();
    });
  }

  incrementalUpdate(removed, added) {
    const addedStats = this.wordCount(added);
    const removedStats = this.wordCount(removed);

    this.stats.characters += addedStats.characters - removedStats.characters;
    this.stats.words += addedStats.words - removedStats.words;
    this.stats.paragraphs += addedStats.paragraphs - removedStats.paragraphs;

    Object.keys(this.stats).forEach((key) => {
      this.stats[key] = Math.max(0, this.stats[key]);
    });
  }

  update(markdown) {
    this.stats = this.wordCount(markdown);
    this.render();
  }

  render() {
    if (this.container) {
      this.container.innerHTML = `
          <span class="cherry-stats-item">
            <span class="material-symbols-outlined">counter_1</span>
            ${this.stats.characters} 字符
          </span>
          <span class="cherry-stats-item">
            <span class="material-symbols-outlined">description</span>
            ${this.stats.words} 词
          </span>
          <span class="cherry-stats-item">
            <span class="material-symbols-outlined">segment</span>
            ${this.stats.paragraphs} 段落
          </span>
        `;
    }
  }

  wordCount(markdown) {
    // 匹配中文和标点符号
    const pattern =
      /[\u4e00-\u9fa5]|[\u3001\u3002\uff01\uff0c\uff1b\uff1a\u201c\u201d\u2018\u2019\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\uff08\uff09\u2014\u2026\u2013\uff0e]/g;
    // 统计字符数量，排除换行和空格
    const characters = markdown.replace(/\n|\s/g, '').length;
    // 统计中文和标点符号
    const chineseWords = (markdown.match(pattern) || []).length;
    // 统计英文单词
    const englishWords = markdown
      .replace(pattern, ' ')
      .split(/[\s\n]+/)
      .filter(Boolean).length;
    const words = chineseWords + englishWords;
    // 统计段落数量，使用至少两个连续换行符分割段落
    const paragraphs = markdown.split(/\n{2,}/).filter((line) => line.trim() !== '').length;
    return { characters, words, paragraphs };
  }

  destroy() {
    if (this.container) {
      Event.off('editor', 'change');
      this.container.remove();
      this.container = null;
    }
  }
}
