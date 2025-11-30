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
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
