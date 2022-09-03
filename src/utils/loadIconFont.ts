// 将所有的字体图标导入
const files = import.meta.glob("../assets/iconFont/**/iconfont.css");
/**
 * 导入所有 svg 配置
 * svg 无法使用 color 更改颜色
 * 需要在公共css文件设置: svg.icon, svg.svg-icon { width: 1em; height: 1em; vertical-align: -0.15em; fill: currentColor; overflow: hidden; }
 */
const svg = import.meta.glob("../assets/iconFont/**/iconfont.js");
const allFiles = {...files, ...svg};
Object.keys(allFiles).map(key => allFiles[key]());
/**
 * 注意：多个 iconfont 时, 在阿里巴巴图标库尽量做到项目设置中的 "FontClass/Symbol 前缀" 不要相同, 防止出现 iconfont 覆盖情况
 * 当前环境已对阿里巴巴图标库的svg引用做一层包装, 使用时可直接 <svg-icon name="icon-xxx" />
 * icon-xxx 中的 icon- 即为 "FontClass/Symbol 前缀", xxx 为图标名称(Font Class/Symbol)
 */
