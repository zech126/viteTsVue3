// 引入 element-plus icons 所有组件，并且全部注册进去
import * as icons from '@element-plus/icons-vue'
// 获取所有组件文件
const files = import.meta.globEager('../components/*/index.ts');
const jsx = import.meta.globEager('../components/*/index.jsx');
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
  // 注册 jsx 文件后缀结尾的组件
  Object.keys(jsx).forEach((key) => {
    // 当不存在组件名时，使用文件名作为组件名
    jsx[key].default && app.component(jsx[key].default.name || key.split('/components/')[1].split('/index.jsx')[0], jsx[key].default);
  });
};
export default install;