import globalApi from "../api/globalApi"; //全局API
//API 入口设置
const apiMaps:object = {};
// 获取所有 views 目录下一级 apiConfig.js 文件
const files = import.meta.globEager("../views/*/apiConfig.ts");
// API 对象
Object.keys(files).forEach((key) => {
  if (files[key].default) {
    Object.keys(files[key].default).forEach(apiKey => {
      apiMaps[apiKey] = files[key].default[apiKey];
      if (!!globalApi[apiKey]) {
        if (typeof apiMaps[apiKey] === 'string' || typeof globalApi[apiKey] === 'string') {
          console.error(`api.${apiKey} 被 globalApi.ts 文件中的 ${apiKey} 覆盖`);
          // 相同 key 赋值
          apiMaps[apiKey] = globalApi[apiKey];
        } else {
          if (!!apiMaps[apiKey]) {
            // 相同 key 覆盖提示
            Object.keys(apiMaps[apiKey]).forEach(lower => {
              !!globalApi[apiKey][lower] && console.error(`api.${apiKey}.${lower} 被 globalApi.ts 文件中的 ${apiKey}.${lower} 覆盖`);
            })
          }
          // 相同 key 合并
          apiMaps[apiKey] = {...apiMaps[apiKey], ...globalApi[apiKey]};
        }
        delete globalApi[apiKey];
      }
    })
  }
});
export default { ...apiMaps, ...globalApi };
