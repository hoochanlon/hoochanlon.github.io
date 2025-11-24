export const SITE = {
  website: "https://hoochanlon.github.io", // replace this with your deployed domain
  author: "hoochanlon",
  profile: "https://hoochanlon.github.io",
  desc: "界面简单的个人博客，用于记录和写作",
  title: "Chanlon Hoo's Blog",
  ogImage: "/public/assets/imgs/astropaper-og.jpg", 
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.dev/hoochanlon/hoochanlon.github.io/edit/master/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
