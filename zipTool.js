//获取文件系统模块，负责文件读写
const fs = require("fs");
//工具模块，处理文件路径
const path = require("path");
// 引入 zip
const JSZIP = require("jszip");
const zip = new JSZIP();
// 资源文件夹
const directory = 'dist';
// 压缩包名
const projectName = 'dist';
// 读取目录下的所有文件
const readDir = (obj, nowPath) =>{
  // 读取目录中的所有文件及文件夹（同步操作）
  const files = fs.readdirSync(nowPath);
  // 遍历检测目录中的文件
  files.forEach((fileName, index) => {
    const fillPath = `${nowPath}/${fileName}`;
    // 获取一个文件的属性
    const file = fs.statSync(fillPath);
    // 如果是目录的话，继续查询
    if (file.isDirectory()) {
      const base = nowPath.split(`${directory}/`)[1];
      // 压缩对象中生成该目录
      const dirlist = zip.folder(`${base ? `${projectName}/${base}` : projectName}/${fileName}`);
      // 重新检索目录文件
      readDir(dirlist, fillPath);
    } else {
      // 压缩目录添加文件
      obj.file(fileName, fs.readFileSync(fillPath));
    }
  })
}

// 压缩文件处理
const startZIP = () => {
  //文件的绝对路径 当前当前js所在的绝对路径
  const currPath = __dirname;
  const zipName = `${currPath}/${projectName}.zip`;
  // 删除压缩文件
  if(fs.existsSync(zipName) && fs.statSync(zipName).isFile()) {
    fs.unlinkSync(zipName);
  }
  // 资源目录
  const targetDir = path.join(currPath, directory);
  // 压缩文件里面新增目录
  const dirlist = zip.folder(projectName);
  readDir(dirlist, targetDir);
  //设置压缩格式，开始打包
  zip.generateAsync({
    type: "nodebuffer",//nodejs用
    compression: "DEFLATE",//压缩算法
    compressionOptions: {//压缩级别
      level: 9
    }
  }).then(function (content) {
    //将打包的内容写入压缩包里
    fs.writeFileSync(zipName, content, "utf-8");
  })
}
// 开始压缩
startZIP();