import globalApi from "./globalApi"; //全局API
const globalPath = '../api/globalApi/globalApi.ts';
//API 入口设置
const apiMaps:object = {};
// 获取所有 views 目录下一级 apiConfig.js 文件
const tsFiles = import.meta.globEager("../views/**/apiConfig.ts");
const jsFiles = import.meta.globEager("../views/**/apiConfig.js");
const files:{[key:string]: any} = {...tsFiles, ...jsFiles};
let apiKeySpin:{[key:string]: string} = {};
// API 对象
Object.keys(files).forEach((key) => {
  if (files[key].default) {
    Object.keys(files[key].default).forEach(apiKey => {
      if (!!apiKeySpin[apiKey]) {
        console.error(`${apiKeySpin[apiKey]} 和 ${key} 存在相同 API 标识：${apiKey}, 相同标识将被覆盖`);
      }
      apiKeySpin[apiKey] = key;
      apiMaps[apiKey] = files[key].default[apiKey];
      if (!!globalApi[apiKey]) {
        if (typeof apiMaps[apiKey] === 'string' || typeof globalApi[apiKey] === 'string') {
          console.error(`${key} 和 ${globalPath} 存在相同 API 标识：${apiKey}, 相同标识将被覆盖`);
          apiMaps[apiKey] = globalApi[apiKey];
        } else {
          if (!!apiMaps[apiKey]) {
            Object.keys(apiMaps[apiKey]).forEach(lower => {
              !!globalApi[apiKey][lower] && console.error(`${key} 和 ${globalPath} 存在相同 API 标识：${apiKey}.${lower}, 相同标识将被覆盖`);
            })
          }
          apiMaps[apiKey] = {...apiMaps[apiKey], ...globalApi[apiKey]};
        }
        delete globalApi[apiKey];
      }
    })
  }
});

export default {...apiMaps, ...globalApi};
