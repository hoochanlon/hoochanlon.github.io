// import { BLOG_PATH } from "@/content.config";
// import { slugifyStr } from "./slugify";

// /**
//  * Get full path of a blog post
//  * @param id - id of the blog post (aka slug)
//  * @param filePath - the blog post full file location
//  * @param includeBase - whether to include `/posts` in return value
//  * @returns blog post path
//  */
// export function getPath(
//   id: string,
//   filePath: string | undefined,
//   includeBase = true
// ) {
//   const pathSegments = filePath
//     ?.replace(BLOG_PATH, "")
//     .split("/")
//     .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
//     .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
//     .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
//     .map(segment => slugifyStr(segment)); // slugify each segment path

//   // If `includeBase` is true, we include the /posts base, otherwise we skip it
//   const basePath = includeBase ? "/posts" : "";

//   // Making sure `id` does not contain the directory
//   const blogId = id.split("/");
//   const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

//   // If not inside a sub-dir, simply return the file path
//   if (!pathSegments || pathSegments.length < 1) {
//     return [basePath, slug].join("/"); // If no segments, return just /posts/slug
//   }

//   return [basePath, ...pathSegments, slug].join("/"); // Otherwise, join /posts + segments + slug
// }



// src/utils/getPath.ts
/**
 * 获取博客文章的完整路径
 * @param slug - 博客文章的 slug（直接从 front-matter 获取）
 * @param filePath - 博客文章的完整文件路径
 * @param includeBase - 是否包含 `/posts` 基础路径
 * @returns 博客文章的路径
 */
export function getPath(
  slug: string,  // 直接传递 slug 参数
  filePath: string | undefined,
  includeBase = true
) {
  // 如果 includeBase 为 true，返回 /posts 基础路径；否则返回空字符串
  const basePath = includeBase ? "/posts" : "";

  // 返回路径 /posts/slug 格式
  return [basePath, slug].join("/");
}
