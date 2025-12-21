/**
 * Extract image URLs from HTML content
 * @param html - HTML content string
 * @returns Array of image URLs
 */
export function extractImageUrls(html: string): string[] {
  const imageUrls: string[] = [];
  
  // Match <img src="..."> tags
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgTagRegex.exec(html)) !== null) {
    imageUrls.push(match[1]);
  }
  
  // Match markdown image syntax: ![](url)
  const markdownImgRegex = /!\[.*?\]\(([^)]+)\)/gi;
  while ((match = markdownImgRegex.exec(html)) !== null) {
    imageUrls.push(match[1]);
  }
  
  return [...new Set(imageUrls)]; // Remove duplicates
}

/**
 * Resolve relative image URLs to absolute URLs
 * @param url - Image URL (can be relative or absolute)
 * @param baseUrl - Base URL for resolving relative URLs
 * @returns Absolute image URL
 */
export function resolveImageUrl(url: string, baseUrl: URL): string {
  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Resolve relative URLs
  return new URL(url, baseUrl).href;
}

