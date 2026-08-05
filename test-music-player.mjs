import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  const consoleWarnings = [];
  
  // 监听控制台消息
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      consoleErrors.push(text);
    } else if (type === 'warning') {
      consoleWarnings.push(text);
    }
  });
  
  // 监听页面错误
  page.on('pageerror', error => {
    consoleErrors.push(`Page Error: ${error.message}`);
  });
  
  try {
    console.log('访问页面...');
    await page.goto('http://localhost:56757/about/', { waitUntil: 'networkidle2', timeout: 10000 });
    
    // 等待音乐播放器加载
    await page.waitForSelector('#music-player', { timeout: 5000 });
    
    // 获取初始状态
    console.log('获取初始状态...');
    const initialState = await page.evaluate(() => {
      const audio = document.querySelector('#music-player');
      const playBtn = document.querySelector('#play-btn');
      const playIcon = playBtn?.querySelector('svg use');
      
      return {
        audioPaused: audio?.paused,
        audioExists: !!audio,
        playBtnExists: !!playBtn,
        iconHref: playIcon?.getAttribute('xlink:href') || playIcon?.getAttribute('href')
      };
    });
    
    console.log('初始状态:', JSON.stringify(initialState, null, 2));
    
    // 点击播放按钮
    console.log('点击播放按钮...');
    await page.click('#play-btn');
    
    // 等待一下让状态更新
    await page.waitForTimeout(500);
    
    // 获取点击后状态
    console.log('获取点击后状态...');
    const afterClickState = await page.evaluate(() => {
      const audio = document.querySelector('#music-player');
      const playBtn = document.querySelector('#play-btn');
      const playIcon = playBtn?.querySelector('svg use');
      
      return {
        audioPaused: audio?.paused,
        iconHref: playIcon?.getAttribute('xlink:href') || playIcon?.getAttribute('href')
      };
    });
    
    console.log('点击后状态:', JSON.stringify(afterClickState, null, 2));
    
    // 输出结果
    console.log('\n===== 测试结果 =====');
    console.log('1. JavaScript错误:', consoleErrors.length > 0 ? consoleErrors : '无');
    console.log('2. 警告信息:', consoleWarnings.length > 0 ? consoleWarnings : '无');
    console.log('3. 按钮图标变化:');
    console.log('   点击前:', initialState.iconHref);
    console.log('   点击后:', afterClickState.iconHref);
    console.log('4. audio.paused值变化:');
    console.log('   点击前:', initialState.audioPaused);
    console.log('   点击后:', afterClickState.audioPaused);
    console.log('5. 自动播放限制提示:', consoleWarnings.some(w => w.includes('autoplay') || w.includes('play()')) ? '有' : '无');
    
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error('控制台错误:', consoleErrors);
  } finally {
    await browser.close();
  }
})();
