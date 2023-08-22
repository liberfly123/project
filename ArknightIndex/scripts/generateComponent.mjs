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
const __dirname = path.dirname(__filename);
const resolves = function(...file){
  log(...file);
  log(__dirname);
  console.log(path.resolve(...'C:/Users/Administrator/Desktop/端口/vue3明日方舟/myarkv3/scripts', ...file))
  return path.resolve(__dirname, ...file);
};

// rgb高亮后台控制台
const { green, blue, red } = rgb;
const log = (message) => console.log(green(`${message}`));
const successLog = (message) => console.log(blue(`${message}`));
const errorLog = (error) => console.log(red(`${error}`));
// 生成导出组件的index.js
import template from "./template.mjs";
const { vueTemplate, entryTemplate } = template;
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
log("请输入要生成的组件名称、如需生成全局组件，请加 global/ 前缀");
let componentName = "";
process.stdin.on("data", async (chunk) => {
  const inputName = String(chunk).trim().toString(); /** * 组件目录路径 */
  const componentDirectory = resolves(
    "../src/components",
    inputName
  ); /** * vue组件路径 */
  // log(inputName)
  // log(resolve("../src/components",inputName))

  const componentVueName = resolves(
    componentDirectory,
    "main.vue"
  ); /** * 入口文件路径 */
  const entryComponentName = resolves(componentDirectory, "index.js");
  const hasComponentDirectory = existsSync(componentDirectory);
  if (hasComponentDirectory) {
    errorLog(`${inputName}组件目录已存在，请重新输入`);
    return;
  } else {
    log(`正在生成 component 目录 ${componentDirectory}`);
    await dotExistDirectoryCreate(componentDirectory);
    // fs.mkdirSync(componentDirectory);
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
    log(`正在生成 entry 文件 ${entryComponentName}`);
    await generateFile(entryComponentName, entryTemplate);
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
} // 递归创建目录
function mkdirs(directory, callback) {
  var exists = existsSync(directory);
  if (exists) {
    callback();
  } else {
    mkdirs(dirname(directory), function () {
      mkdirSync(directory);
      callback();
    });
  }
}
