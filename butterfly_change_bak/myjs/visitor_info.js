(async function () {
  const JS_VERSION = "1.1"; // 每次更新这个值，缓存就会刷新
  const CACHE_KEY = "visitorData";
  const CACHE_EXPIRE = 24 * 60 * 60 * 1000; // 1天
  const containers = document.querySelectorAll(".visitor_content");
  if (!containers.length) return;

  // 工具函数：获取浏览器信息
  function getBrowserInfo() {
    const ua = navigator.userAgent.toLowerCase();
    let name = "未知浏览器", version = "未知版本";
    if (/msie|trident/.test(ua)) { name = "IE"; version = ua.match(/(msie |rv:)([\d.]+)/)?.[2] || ""; }
    else if (/edg/.test(ua)) { name = "Edge"; version = ua.match(/edg\/([\d.]+)/)?.[1] || ""; }
    else if (/firefox/.test(ua)) { name = "Firefox"; version = ua.match(/firefox\/([\d.]+)/)?.[1] || ""; }
    else if (/chrome/.test(ua)) { name = "Chrome"; version = ua.match(/chrome\/([\d.]+)/)?.[1] || ""; }
    else if (/safari/.test(ua)) { name = "Safari"; version = ua.match(/version\/([\d.]+)/)?.[1] || ""; }
    return `${name} ${version}`;
  }

  // 工具函数：带超时的 fetch
  async function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
      fetch(url).then(res => res.json()),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
    ]);
  }

  // 从缓存获取
  let visitorData = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (!visitorData || visitorData.jsVersion !== JS_VERSION || Date.now() - visitorData.timestamp > CACHE_EXPIRE) {
    const browser = getBrowserInfo();

    let ip = "未知", location = "未知位置";
    try {
      const data = await fetchWithTimeout("https://ipapi.co/json/");
      ip = data.ip || "未知";
      location = `${data.country_name || ""} ${data.region || ""}`.trim() || "未知位置";
    } catch {}

    // 异步翻译
    try {
      const res = await fetchWithTimeout(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(location)}&langpair=en|zh-CN`);
      location = res.responseData.translatedText || location;
    } catch {}

    visitorData = { ip, location, browser, timestamp: Date.now(), jsVersion: JS_VERSION };
    localStorage.setItem(CACHE_KEY, JSON.stringify(visitorData));
  }

  // 渲染
  containers.forEach(el => {
    el.innerHTML = `
      欢迎来自 <span class="p">${visitorData.location}</span> 的朋友 🎉<br>
      IP：<span class="p">${visitorData.ip}</span><br>
      浏览器：<span class="p">${visitorData.browser}</span>
    `;
  });
})();
