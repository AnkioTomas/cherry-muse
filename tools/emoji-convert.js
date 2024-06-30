const fs = require('fs');

// 读取原始emoji数据
fs.readFile('emoji.raw.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // 解析JSON数据
  const emojiList = JSON.parse(data);

  // 创建一个按分类存储emoji的对象
  const categorizedEmojiList = {};

  // 处理emoji列表
  emojiList.forEach((emojiData) => {
    // 将emoji转换为Unicode编码
    const emojiUnicode = Array.from(emojiData.emoji)
      .map((c) => c.codePointAt(0).toString(16).padStart(4, '0'))
      .join('-');

    // 创建一个新的对象，只包含需要的字段
    const newEmojiData = {
      emoji: emojiUnicode,
      aliases: emojiData.aliases,
      tags: emojiData.tags,
    };

    // 获取分类
    const { category } = emojiData;

    // 如果分类不存在，创建一个新的数组
    if (!categorizedEmojiList[category]) {
      categorizedEmojiList[category] = [];
    }

    // 将新的emoji数据添加到对应的分类中
    categorizedEmojiList[category].push(newEmojiData);
  });

  // 将按分类存储的列表转换为JSON字符串
  const processedJson = JSON.stringify(categorizedEmojiList, null, 4);

  // 写入处理后的数据到新文件
  fs.writeFile('emoji.json', processedJson, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Data processed and saved to emoji.json');
  });
});
