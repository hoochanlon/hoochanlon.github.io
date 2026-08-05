const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let mainBundleContent = null;
  let mainBundleUrl = null;
  
  // 捕获所有响应
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('.js') && (url.includes('main') || url.includes('bundle'))) {
      try {
        const content = await response.text();
        if (content.length > 1000) {
          mainBundleContent = content;
          mainBundleUrl = url;
          console.log(`✓ 捕获到 JS 文件: ${url.split('/').pop()}`);
        }
      } catch (e) {}
    }
  });
  
  // 捕获控制台消息
  const consoleMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push({ type, text });
    console.log(`[浏览器控制台 ${type}] ${text}`);
  });
  
  // 捕获页面错误
  page.on('pageerror', error => {
    consoleMessages.push({ type: 'error', text: error.toString() });
    console.log(`[浏览器错误] ${error.toString()}`);
  });
  
  console.log('正在访问 http://127.0.0.1:1313...');
  await page.goto('http://127.0.0.1:1313');
  await page.waitForLoadState('networkidle');
  
  const hasScCode = await page.locator('.sc-code').count() > 0;
  
  if (!hasScCode) {
    console.log('首页没有 .sc-code，尝试查找包含代码块的页面...');
    const links = await page.locator('a').evaluateAll(as => 
      as.map(a => a.href).filter(h => h.startsWith('http://127.0.0.1:1313'))
    );
    
    for (const link of links.slice(0, 20)) {
      await page.goto(link);
      await page.waitForLoadState('networkidle');
      const found = await page.locator('.sc-code').count() > 0;
      if (found) {
        console.log(`✓ 找到包含 .sc-code 的页面: ${link}`);
        break;
      }
    }
  }
  
  await page.waitForTimeout(1000);
  
  console.log('\n=== 检查1: Network 面板 - JS 文件内容 ===');
  if (mainBundleContent) {
    console.log(`文件: ${mainBundleUrl}`);
    const hasFailText = mainBundleContent.includes('代码复制失败');
    console.log(`包含 '代码复制失败': ${hasFailText}`);
    
    const has成功Text = mainBundleContent.includes('代码已复制');
    console.log(`包含 '代码已复制': ${has成功Text}`);
    
    if (hasFailText) {
      const index = mainBundleContent.indexOf('代码复制失败');
      console.log(`上下文: ...${mainBundleContent.substring(Math.max(0, index - 80), index + 80)}...`);
    }
    
    // 检查是否有复制相关的代码
    const copyRelated = mainBundleContent.match(/copy|clipboard|复制/gi);
    if (copyRelated) {
      console.log(`找到 ${copyRelated.length} 处复制相关代码片段`);
    }
  } else {
    console.log('❌ 未捕获到主 JS 文件');
  }
  
  console.log('\n=== 检查2: 点击按钮并查看控制台 ===');
  consoleMessages.length = 0;
  
  const copyBtnCount = await page.locator('.sc-code__copy').count();
  console.log(`找到 ${copyBtnCount} 个复制按钮`);
  
  if (copyBtnCount > 0) {
    console.log('点击第一个复制按钮...');
    await page.locator('.sc-code__copy').first().click();
    await page.waitForTimeout(1000);
    
    console.log(`控制台消息数量: ${consoleMessages.length}`);
    if (consoleMessages.length > 0) {
      consoleMessages.forEach(msg => console.log(`  ${msg.type}: ${msg.text}`));
    } else {
      console.log('  （无控制台输出）');
    }
  }
  
  console.log('\n=== 检查3: className 变化 ===');
  const check3Result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const btn = document.querySelector('.sc-code__copy');
      if (!btn) {
        resolve({ error: '未找到按钮' });
        return;
      }
      
      const before = btn.className;
      btn.click();
      const after0ms = btn.className;
      
      setTimeout(() => {
        const after500ms = btn.className;
        resolve({ before, after0ms, after500ms });
      }, 600);
    });
  });
  console.log('点击前:', check3Result.before);
  console.log('点击后 0ms:', check3Result.after0ms);
  console.log('点击后 500ms:', check3Result.after500ms);
  
  console.log('\n=== 检查4: code 元素检查 ===');
  const check4Result = await page.evaluate(() => {
    const btn = document.querySelector('.sc-code__copy');
    const scCode = btn?.closest('.sc-code');
    const code = scCode?.querySelector('pre code');
    return {
      scCodeExists: !!scCode,
      codeExists: !!code,
      preExists: !!scCode?.querySelector('pre'),
      length: code?.textContent?.length,
      preview: code?.textContent?.substring(0, 50),
      structure: scCode ? {
        tagName: scCode.tagName,
        children: Array.from(scCode.children).map(c => c.tagName)
      } : null
    };
  });
  console.log('sc-code 元素存在:', check4Result.scCodeExists);
  console.log('pre 元素存在:', check4Result.preExists);
  console.log('code 元素存在:', check4Result.codeExists);
  console.log('textContent 长度:', check4Result.length);
  console.log('textContent 前50字符:', check4Result.preview);
  console.log('DOM 结构:', JSON.stringify(check4Result.structure, null, 2));
  
  console.log('\n=== 检查5: 复制API测试 ===');
  const check5Result = await page.evaluate(async () => {
    const results = {};
    
    try {
      await navigator.clipboard.writeText('test');
      results.clipboard = '成功';
    } catch (err) {
      results.clipboard = `失败: ${err.name} - ${err.message}`;
    }
    
    const textarea = document.createElement('textarea');
    textarea.value = 'test';
    document.body.appendChild(textarea);
    textarea.select();
    const execResult = document.execCommand('copy');
    textarea.remove();
    results.execCommand = execResult;
    
    return results;
  });
  console.log('clipboard.writeText:', check5Result.clipboard);
  console.log('execCommand copy 返回:', check5Result.execCommand);
  
  await page.screenshot({ path: '/tmp/browser_check.png', fullPage: true });
  console.log('\n✓ 截图已保存到 /tmp/browser_check.png');
  
  await browser.close();
})();
