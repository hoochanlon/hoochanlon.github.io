const minPage = 300;
const maxPage = 350;
const limit = 10;
const targetId = "web_bg";

// 判断是否为主页（根路径或 index.html）
const isHomePage = location.pathname === "/" || location.pathname.endsWith("/index.html");

if (isHomePage) {
  // 主页使用默认背景图
  const target = document.getElementById(targetId);
  if (target) {
    // /img/lofi-girl.png
    // /img/aegis.png
    target.style.backgroundImage = `url(/img/lofi-girl.png)`;
    target.style.backgroundSize = "cover";
    target.style.backgroundPosition = "center";
  }
} else {
  // 其他页面加载 Bing 随机图
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const page = (daySeed % (maxPage - minPage + 1)) + minPage;

  fetch(`https://api.bimg.cc/all?page=${page}&order=asc&limit=${limit}&w=1920&h=1080&mkt=zh-CN`)
    .then(response => response.json())
    .then(data => {
      const images = Array.isArray(data.data) ? data.data : [];
      if (!images.length) throw new Error("图片列表为空");

      const randomIndex = Math.floor(Math.random() * images.length);
      const imageUrl = images[randomIndex].url;

      const img = new Image();
      img.onload = () => {
        const target = document.getElementById(targetId);
        if (target) {
          target.style.backgroundImage = `url(${imageUrl})`;
          target.style.backgroundSize = "cover";
          target.style.backgroundPosition = "center";
        }
      };
      img.onerror = () => {
        console.warn("图片加载失败，使用备用图");
        const fallback = "/img/aegis.png";
        const target = document.getElementById(targetId);
        if (target) {
          target.style.backgroundImage = `url(${fallback})`;
          target.style.backgroundSize = "cover";
          target.style.backgroundPosition = "center";
        }
      };
      img.src = imageUrl;
    })
    .catch(error => {
      console.error("获取 Bing 图片失败：", error);
    });
}
