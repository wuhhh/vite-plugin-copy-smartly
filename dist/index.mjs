// src/index.mjs
import { resolve, relative } from "path";
import fse from "fs-extra";
import chokidar from "chokidar";
function isCopyFile(file, pattern) {
  let isCopyFile2 = false;
  for (let item of pattern) {
    if (item.test(file)) {
      isCopyFile2 = true;
      break;
    }
  }
  return isCopyFile2;
}
function createWatcher(sources) {
  return chokidar.watch(sources, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 50
    }
  });
}
function initWatcher({ src, pattern, dest }) {
  const watcher = createWatcher(src);
  watcher.on("unlink", handleEevent.bind(null, "unlink"));
  watcher.on("add", handleEevent.bind(null, "add"));
  watcher.on("change", handleEevent.bind(null, "change"));
  function handleEevent(event, file) {
    const absoluteFile = resolve(file);
    if (!isCopyFile(absoluteFile, pattern))
      return;
    dest.forEach((destItem) => {
      const destfile = resolve(destItem, relative(src, file));
      switch (event) {
        case "unlink":
          fse.rm(destfile, { force: true });
          break;
        case "add":
        case "change":
          fse.copy(absoluteFile, destfile);
          break;
      }
    });
  }
  return watcher;
}
function getFile(dir) {
  function readdir(dir2) {
    return fse.readdirSync(dir2, { withFileTypes: true }).map((item) => {
      return [item, resolve(dir2, item.name)];
    });
  }
  let files = [];
  const stack = readdir(dir);
  while (stack.length) {
    const [item, absolutePath] = stack.shift();
    if (item.isDirectory()) {
      stack.push(...readdir(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }
  return files;
}
function normalize({ src, pattern, dest }) {
  return {
    src,
    pattern: toArray(pattern),
    dest: toArray(dest)
  };
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function copy(copyTarget) {
  const { src, pattern, dest } = normalize(copyTarget);
  let watcher = null;
  return {
    name: "copy",
    buildStart() {
      getFile(src).forEach((file) => {
        if (isCopyFile(file, pattern)) {
          dest.forEach((destItem) => {
            fse.copy(file, resolve(destItem, relative(src, file)));
          });
        }
      });
      if (this.meta.watchMode && !watcher) {
        watcher = initWatcher({ src, pattern, dest });
      }
    },
    buildEnd() {
      if (watcher) {
        watcher.close();
        watcher = null;
      }
    }
  };
}
var src_default = copy;
export {
  src_default as default
};
