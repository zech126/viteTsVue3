// 引入 element-plus icons 所有组件，并且全部注册进去
import * as icons from '@element-plus/icons-vue';
import { App, Component } from 'vue';

interface FileType {
  [key: string]: Component
}

// 获取所有组件文件
const tsFiles:Record<string, FileType> = import.meta.globEager('../components/**/index.ts');
const jsFiles:Record<string, FileType> = import.meta.globEager('../components/**/index.js');
const tsxFiles:Record<string, FileType> = import.meta.globEager('../components/**/index.tsx');
const jsxFiles:Record<string, FileType> = import.meta.globEager('../components/**/index.jsx');
const vueFiles:Record<string, FileType> = import.meta.globEager('../components/**/index.vue');
const files: Record<string, FileType> = {...tsFiles, ...jsFiles, ...tsxFiles, ...jsxFiles, ...vueFiles};
// let fileCont:{ name?:string; '__name'?:string } = {};
let fileCont: Component = {};
let comKey:{[key:string]:string} = {};
let componentName:{[key:string]:boolean} = {};
const install = (app:App) => {
  // 注册 elementUi 字体图标组件
  Object.keys(icons).forEach((key:string) => {
    app.component(key, icons[key]);
  });

  Object.keys(files).forEach(key => {
    fileCont = files[key]?.default;
    if (!fileCont) return;
    comKey[key] = fileCont.name || '';
    if (!comKey[key]) {
      const keyArr = key.split('/');
      comKey[key] = keyArr[keyArr.length - 2];
    }
    if (componentName[comKey[key]]) {
      console.error(`${key} 导入名为 ${comKey[key]} 组件名, 但 ${comKey[key]} 已被注册，请将重新命名`);
      return;
    }
    componentName[comKey[key]] = true;
    // 注册组件
    app.component(comKey[key], fileCont);
  })
};
export default install;