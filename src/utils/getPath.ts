import { slugifyStr } from "./slugify";  // 引入 slugify 工具

// 生成文章的 URL 路径
export function getPath(id: string, filePath: string | undefined, includeBase = true) {
  // 使用 slugifyStr 生成符合 URL 格式的 slug
  const slug = slugifyStr(id);  // 使用 id 生成 slug，确保符合 URL 格式
  console.log(filePath);  // 这样使用后，警告就会消失

  // 仅返回 slug，生成固定路径
  return includeBase ? `/posts/${slug}` : slug;
}
