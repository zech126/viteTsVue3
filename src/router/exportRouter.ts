import { RouteRecord, RouteRecordNormalized } from 'vue-router'
// 路由入口设置
let routerMaps:Array<RouteRecord> = [];
let routerPath:{[key:string]: string} = {};
// 获取所有 views 目录下一级 routerConfig.js 文件
const tsFiles = import.meta.glob("../views/*/routerConfig.ts");
const jsFiles = import.meta.glob("../views/*/routerConfig.js");
const files = {...tsFiles, ...jsFiles};

const handFiles = ():Promise<Array<{fileKey: string, value: {[key:string]: any}}>> => {
  return new Promise((resolve) => {
    const fileKeys = Object.keys(files);
    const allFileRes = fileKeys.map(key => files[key]());
    Promise.allSettled(allFileRes).then(arr => {
      const filesRes = arr.map((m:any, i) => {
        return { status: m.status, value: m.value.default, fileKey: fileKeys[i]}
      }).filter(f => f.status === 'fulfilled')
      resolve(filesRes);
    })
  })
}

const exportRputer = ():Promise<Array<RouteRecordNormalized>> => {
  return new Promise((resolve) => {
    handFiles().then(allFiles => {
      allFiles.forEach(item => {
        if (item.value) {
          item.value.forEach((rou:RouteRecord) => {
            if (!!routerPath[rou.path]) {
              console.error(`${item.fileKey} 和 ${routerPath[rou.path]} 存在相同路由：${rou.path}`);
            }
            routerPath[rou.path] = item.fileKey;
            routerMaps.push(rou);
          })
        }
      })
      resolve(routerMaps);
    });
  });
}

export default exportRputer;
