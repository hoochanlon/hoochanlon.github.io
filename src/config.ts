export const SITE = {
  website: "https://hoochanlon.github.io", // replace this with your deployed domain
  author: "Chanlon Hoo",
  profile: "https://hoochanlon.github.io",
  desc: "由Github Action搭建的个人博客，用于写作与记录。",
  title: "Hoochanlon",
  ogImage: "og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.dev/hoochanlon/hoochanlon.github.io/edit/main/",
  },
  dynamicOgImage: false,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
