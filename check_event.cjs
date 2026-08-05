const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:1313');
  await page.waitForLoadState('networkidle');
  
  const links = await page.locator('a').evaluateAll(as => 
    as.map(a => a.href).filter(h => h.startsWith('http://127.0.0.1:1313'))
  );
  
  for (const link of links.slice(0, 20)) {
    await page.goto(link);
    await page.waitForLoadState('networkidle');
    const found = await page.locator('.sc-code').count() > 0;
    if (found) break;
  }
  
  console.log('=== 检查按钮事件监听器 ===');
  const eventInfo = await page.evaluate(() => {
    const btn = document.querySelector('.sc-code__copy');
    if (!btn) return { error: '未找到按钮' };
    
    // 检查是否有 onclick 属性
    const onclickAttr = btn.getAttribute('onclick');
    
    // 尝试获取事件监听器（部分浏览器支持）
    const listeners = window.getEventListeners ? window.getEventListeners(btn) : {};
    
    // 检查按钮相关属性
    const attrs = {};
    for (let attr of btn.attributes) {
      attrs[attr.name] = attr.value;
    }
    
    // 检查父元素
    const parent = btn.parentElement;
    
    return {
      onclickAttr,
      attributes: attrs,
      parentTag: parent?.tagName,
      parentClass: parent?.className,
      hasClickListener: Object.keys(listeners).includes('click')
    };
  });
  
  console.log(JSON.stringify(eventInfo, null, 2));
  
  console.log('\n=== 手动触发点击并监控 ===');
  
  // 拦截网络请求
  const requests = [];
  page.on('request', req => {
    requests.push({ url: req.url(), method: req.method() });
  });
  
  // 拦截 console
  const logs = [];
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
  
  await page.evaluate(() => {
    const btn = document.querySelector('.sc-code__copy');
    console.log('即将点击按钮');
    btn.click();
    console.log('点击完成');
  });
  
  await page.waitForTimeout(1000);
  
  console.log('\n控制台日志:');
  logs.forEach(log => console.log('  ' + log));
  
  console.log('\n新发起的请求:');
  if (requests.length > 0) {
    requests.slice(-5).forEach(req => console.log(`  ${req.method} ${req.url}`));
  } else {
    console.log('  （无新请求）');
  }
  
  await browser.close();
})();
