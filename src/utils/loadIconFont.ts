// 将所有的字体图标导入
const files = import.meta.glob("../assets/iconFont/**/iconfont.css");
// console.log(files)
Object.keys(files).map(key => files[key]());
