import { parents } from './tool';
export default function addInsertimageBtn (options: {onclick?:(editor:{[key:string]: any}) => void, index:number, [key:string]: any}) {
  window.temporaryStorage[options.id]['addInsertimageBtn'] = options;
  window.UE.registerUI('multiple-upload', (editor:any, uiName:any) => {
    // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName, {
      execCommand: () => {
        editor.execCommand('inserthtml', ``);
      }
    });
    // 创建一个 button
    let btn = new window.UE.ui.Button({
      // 按钮的名字
      name: uiName,
      // 提示
      title: '插入图片',
      // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
      cssRules: "background-position: -726px -77px",
      // 点击时执行的命令
      onclick: () => {
        const editorid = parents(editor.container, '[editorid]').getAttribute('editorid');
        const current = window.temporaryStorage[editorid]['addInsertimageBtn'];
        // 判断是否配置获取列表文件方法
        if (typeof window.temporaryStorage[editorid].getFiles !== 'function' && typeof window.temporaryStorage[editorid].uploadFiles !== 'function') {
          current.global.$message.warning({
            message: '该功能后端未配置！',
            'showClose': true
          });
          return;
        }
        current.onclick && current.onclick(editor);
      }
    });
    // 当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', () => {
      let state = editor.queryCommandState(uiName);
      if (state === -1) {
        btn.setDisabled(true);
        btn.setChecked(false);
      } else {
        btn.setDisabled(false);
        btn.setChecked(state);
      }
    });
    // 因为是添加 button，所以需要返回这个 button
    return btn;
  }, options.index)
}
