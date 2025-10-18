const hasha = require("hasha");
const minimatch = require("minimatch");

const stream2buffer = (stream) => {
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
};

const readFileAsBuffer = (filePath) => {
  return stream2buffer(hexo.route.get(filePath));
};

const readFileAsString = async (filePath) => {
  const buffer = await readFileAsBuffer(filePath);
  return buffer.toString();
};

const parseFilePath = (filePath) => {
  const parts = filePath.split("/");
  const originalFileName = parts[parts.length - 1];

  const dotPosition = originalFileName.lastIndexOf(".");

  const dirname = parts.slice(0, parts.length - 1).join("/");
  const basename =
    dotPosition === -1
      ? originalFileName
      : originalFileName.substring(0, dotPosition);
  const extension =
    dotPosition === -1 ? "" : originalFileName.substring(dotPosition);

  return [dirname, basename, extension];
};

const genFilePath = (dirname, basename, extension) => {
  let dirPrefix = "";
  if (dirname) {
    dirPrefix += dirname + "/";
  }

  if (extension && !extension.startsWith(".")) {
    extension = "." + extension;
  }

  return dirPrefix + basename + extension;
};

const getRevisionedFilePath = (filePath, revision) => {
  const [dirname, basename, extension] = parseFilePath(filePath);
  return genFilePath(dirname, `${basename}.${revision}`, extension);
};

const revisioned = (filePath) => {
  return getRevisionedFilePath(filePath, `!!revision:${filePath}!!`);
};

hexo.extend.helper.register("revisioned", revisioned);

const calcFileHash = async (filePath) => {
  const buffer = await stream2buffer(hexo.route.get(filePath));
  return hasha(buffer, { algorithm: "sha1" }).substring(0, 8);
};

const replaceRevisionPlaceholder = async () => {
  const options = hexo.config.new_revision || {};
  const include = options.include || [];
  const enable = !!options.enable || false;

  if (!enable) {
    return false;
  }

  const hashPromiseMap = {};
  const hashMap = {};
  const doHash = (filePath) =>
    calcFileHash(filePath).then((hash) => {
      hashMap[filePath] = hash;
    });

  await Promise.all(
    hexo.route.list().map(async (path) => {
      const [, , extension] = parseFilePath(path);
      if (![".css", ".js", ".html"].includes(extension)) {
        return;
      }

      let fileContent = await readFileAsString(path);

      const regexp = /\.!!revision:([^\)]+?)!!/g;
      const matchResult = [...fileContent.matchAll(regexp)];
      if (matchResult.length) {
        const hashTaskList = [];

        // 异步获取文件 hash
        matchResult.forEach((group) => {
          const filePath = group[1];
          if (!(filePath in hashPromiseMap)) {
            hashPromiseMap[filePath] = doHash(filePath);
          }
          hashTaskList.push(hashPromiseMap[filePath]);
        });

        // 等待全部 hash 完成
        await Promise.all(hashTaskList);

        // 替换 placeholder
        fileContent = fileContent.replace(regexp, function (match, filePath) {
          if (!(filePath in hashMap)) {
            throw new Error("file hash not computed");
          }
          return "." + hashMap[filePath];
        });

        hexo.route.set(path, fileContent);
      }
    })
  );

  await Promise.all(
    hexo.route.list().map(async (path) => {
      for (let i = 0, len = include.length; i < len; i++) {
        if (minimatch(path, include[i])) {
          return doHash(path);
        }
      }
    })
  );

  await Promise.all(
    Object.keys(hashMap).map(async (filePath) => {
      hexo.route.set(
        getRevisionedFilePath(filePath, hashMap[filePath]),
        await readFileAsBuffer(filePath)
      );
      hexo.route.remove(filePath);
    })
  );
};

hexo.extend.filter.register("after_generate", replaceRevisionPlaceholder);