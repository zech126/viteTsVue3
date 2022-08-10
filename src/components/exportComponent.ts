// 引入 element-plus icons 所有组件，并且全部注册进去
import * as icons from '@element-plus/icons-vue';
import { App } from 'vue';
// 获取所有组件文件 globEager
const tsFiles = import.meta.glob('../components/*/index.ts');
const jsFiles = import.meta.glob('../components/*/index.js');
const tsxFiles = import.meta.glob('../components/*/index.tsx');
const jsxFiles = import.meta.glob('../components/*/index.jsx');
const vueFiles = import.meta.glob('../components/*/index.vue');

const files = {...tsFiles, ...jsFiles, ...tsxFiles, ...jsxFiles, ...vueFiles};
const start = './';
const end = '/index';
let comName:string = '';
let isRegistered:{[key:string]:boolean} = {};

const handFiles = ():Promise<Array<{fileKey: string, value: {__file?:string, __hmrId:string, __name?:string, name?:string}}>> => {
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

const exportComponent = ():Promise<any> => {
  return new Promise((resolve) => {
    handFiles().then(allFiles => {
      const install = (app:App) => {
        // 注册 elementUi 字体图标组件
        Object.keys(icons).forEach((key:string) => {
          app.component(key, icons[key]);
        });
        allFiles.forEach(item => {
          if (!item.value) return;
          comName =  item.value.name ? item.value.name : item.fileKey.substring(item.fileKey.lastIndexOf(start) + start.length, item.fileKey.lastIndexOf(end));
          if (isRegistered[comName]) {
            console.error(`${item.fileKey} 导入名为 ${comName} 的组件, 但 ${comName} 已被注册，请将重新命名`);
            return;
          }
          isRegistered[comName] = true;
          app.component(comName, item.value);
        })
      };
      resolve(install);
    })
  });
}

export default exportComponent;