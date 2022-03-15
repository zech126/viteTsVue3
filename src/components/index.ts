// import { ComputedOptions } from 'vue';
// 引入 element-plus icons 所有组件，并且全部注册进去
import * as icons from '@element-plus/icons-vue'
// 获取所有组件文件
const files = import.meta.globEager('../components/*/index.ts');
const jsx = import.meta.globEager('../components/*/index.jsx');
const install = (app:any) => {
  Object.keys(icons).forEach((key:any) => {
    // @ts-ignore
    app.component(key, icons[key]);
  });
  Object.keys(files).forEach((key) => {
    if (files[key].default && files[key].default.isGlobal) {
      app.component(files[key].default.name, files[key].default);
    }
  });
  Object.keys(jsx).forEach((key) => {
    if (jsx[key].default && jsx[key].default.isGlobal) {
      app.component(jsx[key].default.name, jsx[key].default);
    }
  });
};
export default install;