export const SITE = {
  website: "https://blog.hoochanlon.moe",  // 更新为你的新网站
  author: "hoochanlon",
  profile: "https://hoochanlon.moe",
  desc: "个人博客，记录生活与学习。",
  title: "Chanlon Hoo's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.dev/hoochanlon/hoochanlon.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",  
  timezone: "Asia/Shanghai",  // 上海时区
} as const;
