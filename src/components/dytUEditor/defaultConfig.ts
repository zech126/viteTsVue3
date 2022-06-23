
export const editorConfig:editorType = {
  // 为编辑器实例添加一个路径，这个不能被注释
  UEDITOR_HOME_URL: './ueditor/',
  // 文件上传功服务端接口
  serverUrl: '',
  // 初始容器高度
  initialFrameHeight: 400,
  // 工具栏是否浮动
  // autoFloatEnabled: false,
  // 初始容器宽度
  initialFrameWidth: '100%'
}

export const defaultLoad = ['ueditor.config.js', 'ueditor.all.min.js', 'ueditor.parse.min.js'];

export default {
  editorConfig: editorConfig
};