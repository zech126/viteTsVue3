// 引入 element-plus icons 所有组件，并且全部注册进去
import * as icons from '@element-plus/icons-vue'
// 获取所有组件文件
const files = import.meta.globEager('../components/*/index.ts');
const tsx = import.meta.globEager('../components/*/index.tsx');
const install = (app:any) => {
  // 注册 elementUi 字体图标组件
  Object.keys(icons).forEach((key:any) => {
    app.component(key, icons[key]);
  });
  // 注册 ts 文件后缀结尾的组件
  Object.keys(files).forEach((key) => {
    // 当不存在组件名时，使用文件名作为组件名
    files[key].default && app.component(files[key].default.name || key.split('/components/')[1].split('/index.ts')[0], files[key].default);
  });
  // 注册 tsx 文件后缀结尾的组件
  Object.keys(tsx).forEach((key) => {
    // 当不存在组件名时，使用文件名作为组件名
    tsx[key].default && app.component(tsx[key].default.name || key.split('/components/')[1].split('/index.tsx')[0], tsx[key].default);
  });
};
export default install;