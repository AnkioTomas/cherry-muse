const fs = require('fs');

// 读取原始emoji数据
fs.readFile('emoji.raw.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // 解析JSON数据
  const emojiList = JSON.parse(data);

  // 处理emoji列表
  const processedEmojiList = emojiList.map(emojiData => {
    // 将emoji转换为Unicode编码
    const emojiUnicode = Array.from(emojiData.emoji).map(c => c.codePointAt(0).toString(16).padStart(4, '0')).join('-');

    // 创建一个新的对象，只包含需要的字段
    const newEmojiData = {
      "emoji": emojiUnicode,
      "category": emojiData.category,
      "aliases": emojiData.aliases,
      "tags": emojiData.tags
    };
    return newEmojiData;
  });

  // 将处理后的列表转换为JSON字符串
  const processedJson = JSON.stringify(processedEmojiList, null, 4);

  // 写入处理后的数据到新文件
  fs.writeFile('emoji.json', processedJson, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Data processed and saved to emoji.json');
  });
});
