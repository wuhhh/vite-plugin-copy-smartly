var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.mjs
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_path = require("path");
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_chokidar = __toESM(require("chokidar"), 1);
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
  return import_chokidar.default.watch(sources, {
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
    const absoluteFile = (0, import_path.resolve)(file);
    if (!isCopyFile(absoluteFile, pattern))
      return;
    dest.forEach((destItem) => {
      const destfile = (0, import_path.resolve)(destItem, (0, import_path.relative)(src, file));
      switch (event) {
        case "unlink":
          import_fs_extra.default.rm(destfile, { force: true });
          break;
        case "add":
        case "change":
          import_fs_extra.default.copy(absoluteFile, destfile);
          break;
      }
    });
  }
  return watcher;
}
function getFile(dir) {
  function readdir(dir2) {
    return import_fs_extra.default.readdirSync(dir2, { withFileTypes: true }).map((item) => {
      return [item, (0, import_path.resolve)(dir2, item.name)];
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
            import_fs_extra.default.copy(file, (0, import_path.resolve)(destItem, (0, import_path.relative)(src, file)));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
