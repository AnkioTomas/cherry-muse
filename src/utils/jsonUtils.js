export default function extraJSON(src) {
  if (typeof src === 'object') {
    return src;
  }
  try {
    return JSON.parse(src);
  } catch (e) {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return ${src}`);
    try {
      return fn();
    } catch (e) {
      console.error('解析错误:', e);
    }
    return {};
  }
}
