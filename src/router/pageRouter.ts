import { RouteRecord } from 'vue-router'
// 路由入口设置
let routerMaps:Array<RouteRecord> = [];
// 获取所有 views 目录下一级 routerConfig.js 文件
const files = import.meta.globEager("../views/*/routerConfig.ts");
// 相同路由不做提示
Object.keys(files).forEach((key) => {
  if (files[key].default) {
    routerMaps = [...routerMaps, ...files[key].default];
  }
});
export default routerMaps;
