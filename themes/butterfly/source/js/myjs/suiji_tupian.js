// const targetId = "web_bg";

// // 判断是否为主页（根路径或 index.html）或 /page/ 页面
// const isHomePage = location.pathname === "/" || location.pathname.endsWith("/index.html");
// const isPage = location.pathname.startsWith("/page/"); // 判断是否是 /page/ 页面

// // 获取当前的月份
// const currentMonth = new Date().getMonth(); // 获取当前月份，0表示1月，11表示12月

// // 根据月份判断季节
// let seasonImage;
// if (currentMonth >= 2 && currentMonth <= 4) { // 春季 (3月-5月)
//   seasonImage = "/img/spring.png";
// } else if (currentMonth >= 5 && currentMonth <= 7) { // 夏季 (6月-8月)
//   seasonImage = "/img/blue-sea-and-sky.png";
// } else if (currentMonth >= 8 && currentMonth <= 10) { // 秋季 (9月-11月)
//   seasonImage = "/img/fall.png";
// } else { // 冬季 (12月-2月)
//   seasonImage = "/img/cold.png";
// }

// const target = document.getElementById(targetId);
// if (target) {
//   // 设置默认背景图
//   const defaultImage = "/img/xp.png"; // 默认背景图
//   target.style.backgroundImage = `url(${defaultImage})`;
//   target.style.backgroundSize = "cover";
//   target.style.backgroundPosition = "center";

//   let imageUrl = (isHomePage || isPage) ? seasonImage : "https://bing.img.run/rand.php";

//   // 创建一个 Image 对象来加载图片
//   const img = new Image();
//   img.onload = () => {
//     // 图片加载完成后，更新背景图片
//     target.style.backgroundImage = `url(${imageUrl})`;
//     target.style.backgroundSize = "cover";
//     target.style.backgroundPosition = "center";
//     target.style.transition = "background-image 0.5s ease"; // 可选：平滑过渡效果
//   };
//   img.src = imageUrl; // 开始加载图片
// }


const targetId = "web_bg";

// 判断是否为主页（根路径或 index.html）或 /page/ 页面
const isHomePage = location.pathname === "/" || location.pathname.endsWith("/index.html");
const isPage = location.pathname.startsWith("/page/"); // 判断是否是 /page/ 页面

// 获取当前的月份
const currentMonth = new Date().getMonth(); // 获取当前月份，0表示1月，11表示12月

// 根据月份判断季节
let seasonImage;
if (currentMonth >= 2 && currentMonth <= 4) { // 春季 (3月-5月)
  seasonImage = "/img/spring.png";
} else if (currentMonth >= 5 && currentMonth <= 7) { // 夏季 (6月-8月)
  seasonImage = "/img/blue-sea-and-sky.png";
} else if (currentMonth >= 8 && currentMonth <= 10) { // 秋季 (9月-11月)
  seasonImage = "/img/fall.png";
} else { // 冬季 (12月-2月)
  seasonImage = "/img/cold.png";
}

const target = document.getElementById(targetId);
if (target) {
  // 设置默认背景图
  const defaultImage = "/img/xp.png"; // 默认背景图
  target.style.backgroundImage = `url(${defaultImage})`;
  target.style.backgroundSize = "cover";
  target.style.backgroundPosition = "center";
  target.style.transition = "background-image 0.5s ease"; // 过渡效果
  
  let imageUrl = (isHomePage || isPage) ? seasonImage : "https://bing.img.run/rand.php";

  // 创建一个 Image 对象来加载图片
  const img = new Image();
  img.onload = () => {
    // 图片加载完成后，更新背景图片并进行渐变过渡
    target.style.backgroundImage = `url(${imageUrl})`;
    target.classList.add("image-loaded"); // 添加已加载的class
  };

  img.src = imageUrl; // 开始加载图片
}
