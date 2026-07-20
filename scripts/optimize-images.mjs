/**
 * 批量优化站内图片（content / static / assets）
 * - 最长边 > 1600 → 等比缩小
 * - 体积超过阈值才处理；仅当结果明显更小才写回
 * - 不改扩展名、不进 themes/
 *
 * 用法：
 *   pnpm install
 *   pnpm optimize-images
 *   pnpm optimize-images:dry
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SCAN_DIRS = ["content", "static", "assets"];
const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "themes",
  "public",
  "resources",
]);
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MAX_EDGE = 1600;
const MIN_BYTES = 80 * 1024; // 小于此体积默认跳过
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 78;
const MIN_SAVE_RATIO = 0.05; // 至少省 5% 才覆盖

const dryRun = process.argv.includes("--dry-run");

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIR_NAMES.has(ent.name)) continue;
      yield* walk(full);
    } else if (ent.isFile()) {
      yield full;
    }
  }
}

function isImage(file) {
  return EXT.has(path.extname(file).toLowerCase());
}

async function optimizeOne(file) {
  const stat = await fs.stat(file);
  if (stat.size < MIN_BYTES) return { file, status: "skip-small", before: stat.size };

  const ext = path.extname(file).toLowerCase();
  let img = sharp(file, { animated: false, failOn: "none" });
  let meta;
  try {
    meta = await img.metadata();
  } catch (e) {
    return { file, status: "skip-meta", error: String(e), before: stat.size };
  }

  if (meta.pages && meta.pages > 1) {
    return { file, status: "skip-animated", before: stat.size };
  }

  const w = meta.width || 0;
  const h = meta.height || 0;
  const longEdge = Math.max(w, h);
  const needResize = longEdge > MAX_EDGE;

  // 既不大也不算「可明显再压」的跳过：小尺寸且 < 200KB
  if (!needResize && stat.size < 200 * 1024) {
    return { file, status: "skip-ok", before: stat.size };
  }

  if (needResize) {
    img = img.resize({
      width: longEdge === w ? MAX_EDGE : undefined,
      height: longEdge === h ? MAX_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  img = img.rotate(); // 尊重 EXIF 方向

  let pipeline;
  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === ".webp") {
    pipeline = img.webp({ quality: WEBP_QUALITY, effort: 4 });
  } else if (ext === ".png") {
    pipeline = img.png({ compressionLevel: 9, palette: false });
  } else {
    return { file, status: "skip-ext", before: stat.size };
  }

  const out = await pipeline.toBuffer({ resolveWithObject: false });
  const saved = stat.size - out.length;
  const ratio = saved / stat.size;

  if (out.length >= stat.size || ratio < MIN_SAVE_RATIO) {
    return {
      file,
      status: "skip-no-gain",
      before: stat.size,
      after: out.length,
    };
  }

  if (!dryRun) {
    await fs.writeFile(file, out);
  }

  return {
    file,
    status: dryRun ? "would-write" : "written",
    before: stat.size,
    after: out.length,
    resized: needResize,
  };
}

function fmt(n) {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

async function main() {
  const results = [];
  for (const rel of SCAN_DIRS) {
    const dir = path.join(ROOT, rel);
    for await (const file of walk(dir)) {
      if (!isImage(file)) continue;
      try {
        results.push(await optimizeOne(file));
      } catch (e) {
        results.push({ file, status: "error", error: String(e) });
      }
    }
  }

  const changed = results.filter((r) =>
    ["written", "would-write"].includes(r.status)
  );
  let savedTotal = 0;
  for (const r of changed) {
    savedTotal += (r.before || 0) - (r.after || 0);
    const rel = path.relative(ROOT, r.file);
    console.log(
      `${r.status}\t${fmt(r.before)} → ${fmt(r.after)}\t${r.resized ? "resize " : ""}${rel}`
    );
  }

  const errors = results.filter((r) => r.status === "error");
  for (const r of errors) {
    console.error(`error\t${path.relative(ROOT, r.file)}\t${r.error}`);
  }

  console.log(
    `\n${dryRun ? "[dry-run] " : ""}optimized ${changed.length} file(s), saved ~${fmt(savedTotal)} (scanned ${results.length})`
  );

  if (errors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
