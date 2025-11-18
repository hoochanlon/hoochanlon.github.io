// 随机生成博客内指定的图片
// let backimg = ["url(/img/p5r.png)", "url(/img/lofi-girl.png)", "url(/img/p3r.png)"];
// let index = Math.floor(Math.random() * backimg.length);
// document.getElementById("web_bg").style.backgroundImage = backimg[index];


// 获取今天的日期作为种子，确保每天不同但稳定
// const today = new Date();
// const idx = today.getDate() % 8; // Bing API 支持最近 8 天

// // 请求 Bing 每日图片
// fetch(`https://bing.biturl.top/?format=json&idx=${idx}&n=1&mkt=zh-CN`)
//   .then(response => response.json())
//   .then(data => {
//     const imageUrl = data.url;
//     const target = document.getElementById("web_bg");
//     if (target) {
//       target.style.backgroundImage = `url(${imageUrl})`;
//       target.style.backgroundSize = "cover";
//       target.style.backgroundPosition = "center";
//     }
//   })
//   .catch(error => {
//     console.error("获取 Bing 图片失败：", error);
//   });


/* 每次刷新随机一张 Bing 图*/
// const minPage = 300;
// const maxPage = 350;
// const limit = 10;
// const targetId = "web_bg";

// // 每天生成稳定页码（只在 300–350 范围内）
// const today = new Date();
// const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
// const page = (daySeed % (maxPage - minPage + 1)) + minPage;

// // 请求 Bing 图片 API
// fetch(`https://api.bimg.cc/all?page=${page}&order=asc&limit=${limit}&w=1920&h=1080&mkt=zh-CN`)
//   .then(response => response.json())
//   .then(data => {
//     const images = Array.isArray(data.data) ? data.data : [];
//     if (!images.length) throw new Error("图片列表为空");

//     const randomIndex = Math.floor(Math.random() * images.length);
//     const imageUrl = images[randomIndex].url;

//     const img = new Image();
//     img.onload = () => {
//       const target = document.getElementById(targetId);
//       if (target) {
//         target.style.backgroundImage = `url(${imageUrl})`;
//         target.style.backgroundSize = "cover";
//         target.style.backgroundPosition = "center";
//       }
//     };
//     img.onerror = () => {
//       console.warn("图片加载失败，使用备用图");
//       // const fallback = "/img/lofi-girl.png";
//       const fallback = "/img/aegis.png";
//       const target = document.getElementById(targetId);
//       if (target) {
//         target.style.backgroundImage = `url(${fallback})`;
//         target.style.backgroundSize = "cover";
//         target.style.backgroundPosition = "center";
//       }
//     };
//     img.src = imageUrl;
//   })
//   .catch(error => {
//     console.error("获取 Bing 图片失败：", error);
//   });


// const minPage = 300;
// const maxPage = 350;
// const limit = 10;
// const targetId = "web_bg";

// // 判断是否为主页（根路径或 index.html）
// const isHomePage = location.pathname === "/" || location.pathname.endsWith("/index.html");

// if (isHomePage) {
//   // 主页使用默认背景图
//   const target = document.getElementById(targetId);
//   if (target) {
//     // /img/lofi-girl.png
//     // /img/aegis.png
//     target.style.backgroundImage = `url(/img/blue-sea-and-sky.png)`;
//     target.style.backgroundSize = "cover";
//     target.style.backgroundPosition = "center";
//   }
// } else {
//   // 其他页面加载 Bing 随机图
//   const today = new Date();
//   const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
//   const page = (daySeed % (maxPage - minPage + 1)) + minPage;

//   fetch(`https://api.bimg.cc/all?page=${page}&order=asc&limit=${limit}&w=1920&h=1080&mkt=zh-CN`)
//     .then(response => response.json())
//     .then(data => {
//       const images = Array.isArray(data.data) ? data.data : [];
//       if (!images.length) throw new Error("图片列表为空");

//       const randomIndex = Math.floor(Math.random() * images.length);
//       const imageUrl = images[randomIndex].url;

//       const img = new Image();
//       img.onload = () => {
//         const target = document.getElementById(targetId);
//         if (target) {
//           target.style.backgroundImage = `url(${imageUrl})`;
//           target.style.backgroundSize = "cover";
//           target.style.backgroundPosition = "center";
//         }
//       };
//       img.onerror = () => {
//         console.warn("图片加载失败，使用备用图");
//         const fallback = "https://bing.img.run/rand.php";
//         const target = document.getElementById(targetId);
//         if (target) {
//           target.style.backgroundImage = `url(${fallback})`;
//           target.style.backgroundSize = "cover";
//           target.style.backgroundPosition = "center";
//         }
//       };
//       img.src = imageUrl;
//     })
//     .catch(error => {
//       console.error("获取 Bing 图片失败：", error);
//     });
// }




const targetId = "web_bg";

// 判断是否为主页（根路径或 index.html）
const isHomePage = location.pathname === "/" || location.pathname.endsWith("/index.html");

const target = document.getElementById(targetId);
if (target) {
  // 设置默认背景图
  const defaultImage = "/img/xp.png"; // 默认背景图
  target.style.backgroundImage = `url(${defaultImage})`;
  target.style.backgroundSize = "cover";
  target.style.backgroundPosition = "center";

  let imageUrl = isHomePage ? "/img/blue-sea-and-sky.png" : "https://bing.img.run/rand.php";

  // 创建一个 Image 对象来加载图片
  const img = new Image();
  img.onload = () => {
    // 图片加载完成后，更新背景图片
    target.style.backgroundImage = `url(${imageUrl})`;
    target.style.backgroundSize = "cover";
    target.style.backgroundPosition = "center";
    target.style.transition = "background-image 0.5s ease"; // 可选：平滑过渡效果
  };
  img.src = imageUrl; // 开始加载图片
}
