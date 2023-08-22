// 高亮颜色定义
import rgb from "chalk";
// 路径决定
import { resolve, dirname } from "path";
// 文件目录和文件生成
import { existsSync, writeFile, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
// 文件路径
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const resolves = function (...file) {
  console.log( path.resolve(__dirname, ...file))
  return path.resolve(__dirname, ...file);
};

// rgb高亮后台控制台
const { green, blue, red } = rgb;
const log = (message) => console.log(green(`${message}`));
const successLog = (message) => console.log(blue(`${message}`));
const errorLog = (error) => console.log(red(`${error}`));
import template from "./template.mjs";
const { vueTemplate } = template;
const generateFile = (path, data) => {
  if (existsSync(path)) {
    errorLog(`${path}文件已存在`);
    return;
  }
  return new Promise((resolve, reject) => {
    writeFile(path, data, "utf8", (err) => {
      if (err) {
        errorLog(err.message);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
log("请输入要生成的页面组件名称、会生成在 views/目录下");
let componentName = "";
process.stdin.on("data", async (chunk) => {
  const inputName = String(chunk).trim().toString(); /** * Vue页面组件路径 */
  let componentVueName = resolves("../src/views", inputName);
  // 如果不是以 .vue 结尾的话，自动加上 
  if (!componentVueName.endsWith('.vue')) { componentVueName += '.vue' }
  /** * vue组件目录路径 */ const componentDirectory = dirname(componentVueName);
  const hasComponentExists = existsSync(componentVueName);
  if (hasComponentExists) {
    errorLog(`${inputName}页面组件已存在，请重新输入`);
    return;
  } else {
    log(`正在生成 component 目录 ${componentDirectory}`);
    await dotExistDirectoryCreate(componentDirectory);
  }
  try {
    if (inputName.includes("/")) {
      const inputArr = inputName.split("/");
      componentName = inputArr[inputArr.length - 1];
    } else {
      componentName = inputName;
    }
    log(`正在生成 vue 文件 ${componentVueName}`);
    await generateFile(componentVueName, vueTemplate(componentName));
    successLog("生成成功");
  } catch (e) {
    errorLog(e.message);
  }
  process.stdin.emit("end");
});
process.stdin.on("end", () => {
  log("exit");
  process.exit();
});
function dotExistDirectoryCreate(directory) {
  return new Promise((resolve) => {
    mkdirs(directory, function () {
      resolve(true);
    });
  });
}
// 递归创建目录
function mkdirs(directory, callback) {
  var exists = existsSync(directory);
  if (exists) {
    callback();
  } else {
    mkdirs(path.dirname(directory), function () {
      mkdirSync(directory);
      callback();
    });
  }
}
