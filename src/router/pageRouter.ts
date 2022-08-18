import { RouteRecordRaw } from 'vue-router'
// 路由入口设置
let routerMaps:Array<RouteRecordRaw> = [];
let routerPath:{[key:string]: string} = {};
// 获取所有 views 目录下一级 routerConfig.js 文件
const tsFiles = import.meta.globEager("../views/**/routerConfig.ts");
const jsFiles = import.meta.globEager("../views/**/routerConfig.js");
const files:{[key:string]: any} = {...tsFiles, ...jsFiles};
// 相同路由不做提示
Object.keys(files).forEach((key) => {
  if (files[key].default) {
    files[key].default.forEach((rou:RouteRecordRaw) => {
      if (!!routerPath[rou.path]) {
        console.error(`${key} 和 ${routerPath[rou.path]} 存在相同路由：${rou.path}`);
      }
      routerPath[rou.path] = key;
      routerMaps.push(rou);
    })
    // routerMaps = [...routerMaps, ...files[key].default];
  }
});
export default routerMaps;
