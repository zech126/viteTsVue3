//API 入口设置
import globalApi from "../api/globalApi"; //全局API
const globalPath = '../api/globalApi/globalApi.ts';
// 获取所有 views 目录下一级 apiConfig.js 文件
const tsFiles = import.meta.glob("../views/*/apiConfig.ts");
const jsFiles = import.meta.glob("../views/*/apiConfig.js");
type filesResType = Array<{status:string, fileKey: string, value: {[key:string]: any}}>;
const files = {...tsFiles, ...jsFiles};
let fileKeys:Array<string> = [];
let allFileRes:Array<Promise<unknown>> = [];
let filesRes:filesResType = [];

const handFiles = ():Promise<filesResType> => {
  return new Promise((resolve) => {
    fileKeys = Object.keys(files);
    allFileRes = fileKeys.map(key => files[key]());
    Promise.allSettled(allFileRes).then(arr => {
      filesRes = arr.map((m:any, i) => {
        return { status: m.status, value: m.value.default, fileKey: fileKeys[i]}
      }).filter(f => f.status === 'fulfilled')
      resolve(filesRes);
    })
  })
}

const apiMaps:object = {};
let apiKeySpin:{[key:string]: string} = {};

const exportApi = ():Promise<object> => {
  return new Promise((resolve) => {
    handFiles().then(allFiles => {
      // API 对象
      allFiles.forEach(item => {
        if (!item.value) return;
        Object.keys(item.value).forEach(apiKey => {
          if (!!apiKeySpin[apiKey]) {
            console.error(`${apiKeySpin[apiKey]} 和 ${item.fileKey} 存在相同 API 标识：${apiKey}, 相同标识将被覆盖`);
          }
          apiKeySpin[apiKey] = item.fileKey;
          apiMaps[apiKey] = item.value[apiKey];
          if (!!globalApi[apiKey]) {
            if (typeof apiMaps[apiKey] === 'string' || typeof globalApi[apiKey] === 'string') {
              console.error(`${item.fileKey} 和 ${globalPath} 存在相同 API 标识：${apiKey}, 相同标识将被覆盖`);
              apiMaps[apiKey] = globalApi[apiKey];
            } else {
              if (!!apiMaps[apiKey]) {
                Object.keys(apiMaps[apiKey]).forEach(lower => {
                  !!globalApi[apiKey][lower] && console.error(`${item.fileKey} 和 ${globalPath} 存在相同 API 标识：${apiKey}.${lower}, 相同标识将被覆盖`);
                })
              }
              apiMaps[apiKey] = {...apiMaps[apiKey], ...globalApi[apiKey]};
            }
            delete globalApi[apiKey];
          }
        })
      });
      resolve({...apiMaps, ...globalApi});
    })
  });
}

export default exportApi;
