// ------------------------------
// 获取浏览器信息
// ------------------------------
function getBrowserInfo() {
  const ua = navigator.userAgent.toLowerCase();
  let name = "未知浏览器";
  let version = "未知版本";

  if (/msie|trident/.test(ua)) {
    name = "Internet Explorer";
    version = ua.match(/(msie |rv:)([\d.]+)/)?.[2] || "";
  } else if (/edg/.test(ua)) {
    name = "Microsoft Edge";
    version = ua.match(/edg\/([\d.]+)/)?.[1] || "";
  } else if (/firefox/.test(ua)) {
    name = "Mozilla Firefox";
    version = ua.match(/firefox\/([\d.]+)/)?.[1] || "";
  } else if (/chrome/.test(ua)) {
    name = "Google Chrome";
    version = ua.match(/chrome\/([\d.]+)/)?.[1] || "";
  } else if (/safari/.test(ua)) {
    name = "Safari";
    version = ua.match(/version\/([\d.]+)/)?.[1] || "";
  }

  return `${name} ${version}`;
}

// ------------------------------
// 调用 MyMemory 翻译 API（英文→中文）
// ------------------------------
async function translateToChinese(text) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData.translatedText || text;
  } catch (err) {
    console.warn("翻译失败:", err);
    return text;
  }
}

// ------------------------------
// 获取 IP 与地理位置（来自 ipapi.co）
// ------------------------------
async function getIPAndLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const { ip, country_name, region, city } = data;
    const englishLocation = `${country_name} ${region} ${city}`;
    const chineseLocation = await translateToChinese(englishLocation);

    return {
      ip,
      location: chineseLocation,
    };
  } catch (err) {
    console.error("获取 IP 信息失败:", err);
    return {
      ip: "未知",
      location: "未知位置",
    };
  }
}

// ------------------------------
// 渲染内容到页面
// ------------------------------
async function showVisitorInfo() {
  const ipContent = document.querySelector(".ip_content");
  if (!ipContent) return;

  const browserInfo = getBrowserInfo();
  const { ip, location } = await getIPAndLocation();

  ipContent.innerHTML = `
    欢迎来自 <span class="p">${location}</span> 的小伙伴！<br>
    访问 IP：<span class="p">${ip}</span><br>
    浏览器：<span class="p">${browserInfo}</span>
  `;
}

// 页面加载完后执行
document.addEventListener("DOMContentLoaded", showVisitorInfo);
