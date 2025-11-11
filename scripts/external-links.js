const { URL } = require('url');

hexo.extend.filter.register('after_render:html', function (htmlContent) {
  // 获取博客配置中的 URL
  const siteUrl = new URL(hexo.config.url).origin;

  // 匹配所有 <a> 标签
  const regex = /<a\s+([^>]*)>/gi;

  return htmlContent.replace(regex, (match, attributes) => {
    // 解析属性
    const attrMap = {};
    attributes.replace(/(\w+)\s*=\s*(["'])(.*?)\2/gi, (_, key, quote, value) => {
      attrMap[key] = value;
      return '';
    });

    // 获取 href 属性
    const href = attrMap.href;

    // 判断是否是外部链接
    let isExternal = false;
    try {
      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        const url = new URL(href, siteUrl);
        isExternal = url.origin !== siteUrl;
      }
    } catch (e) {
      // 忽略无效的 URL
      console.warn(`Invalid URL: ${href}`);
    }

    // 如果是外部链接，则替换或添加 rel 属性
    if (isExternal) {
      attrMap.rel = 'noopener noreferrer nofollow';
    }

    // 重新生成 <a> 标签
    const newAttributes = Object.keys(attrMap)
      .map(key => `${key}="${attrMap[key]}"`)
      .join(' ');

    return `<a ${newAttributes}>`;
  });
});
