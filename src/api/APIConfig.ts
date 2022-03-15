import globalApi from "../api/globalApi"; //全局API
//API 入口设置
const apiMaps:object = {};
// 获取所有 views 目录下一级 apiConfig.js 文件
const files = import.meta.globEager("../views/*/apiConfig.ts");
// console.log(files)
// 相同 API 不做提示
Object.keys(files).forEach((key) => {
  if (files[key].default) {
    Object.keys(files[key].default).forEach(apiKey => {
      // @ts-ignore
      apiMaps[apiKey] = files[key].default[apiKey];
      // @ts-ignore
      if (!!globalApi[apiKey]) {
        // @ts-ignore
        apiMaps[apiKey] = {...apiMaps[apiKey], ...lobalApi[apiKey]}
        // @ts-ignore
        delete globalApi[apiKey];
      }
    })
  }
});
export default { ...apiMaps, ...globalApi };
