/**
 * 异步加密函数
 *
 * @param data 要加密的字符串
 * @param key 密码
 *
 * @returns 加密后的 Base64 字符串
 */
export async function encrypt(data: string, key: string): Promise<string> {
  // AES-CBC 要求 key 长度至少 16 字节，不够用 '0' 补齐
  key = key.padEnd(16, "0");
  // 将字符串编码为 Uint8Array
  const dataBuffer = new TextEncoder().encode(data);
  const keyBuffer = new TextEncoder().encode(key);
  // 导入 key，生成加密用的 CryptoKey
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );
  // 生成随机 16 字节 IV
  const iv = crypto.getRandomValues(new Uint8Array(16));
  // 加密
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    dataBuffer
  );
  // 将 IV 和密文组合，前 16 字节为 IV
  const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
  combinedData.set(iv);
  combinedData.set(new Uint8Array(encryptedData), iv.length);
  // 转成 Base64 字符串返回
  return uint8ToBase64(combinedData);
}

function uint8ToBase64(bytes: Uint8Array): string {
  // 使用 Buffer 在 Node.js 环境
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  // 浏览器环境：手动实现 Base64 编码（替代已弃用的 btoa）
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const bitmap = (a << 16) | (b << 8) | c;
    result += base64Chars.charAt((bitmap >> 18) & 63);
    result += base64Chars.charAt((bitmap >> 12) & 63);
    result += i + 1 < bytes.length ? base64Chars.charAt((bitmap >> 6) & 63) : "=";
    result += i + 2 < bytes.length ? base64Chars.charAt(bitmap & 63) : "=";
  }
  return result;
}
