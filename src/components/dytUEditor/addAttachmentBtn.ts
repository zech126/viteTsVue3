import common from '@/utils/common';
import { parents } from './tool';
// 获取选中的文件
const getFiles = (event:Event) => {
  let target:any = event.target || event.srcElement;
  const filename = target.value;
  const files = target.files;
  const fLength = files.length;
  let index = 0;
  let newFiles:Array<any> = [];
  if (fLength <= 0 || !filename) return newFiles;
  for (index; index < fLength; index++) {
    newFiles.push(files[index]);
  }
  target.value = '';
  return newFiles;
}
// 移除加载提示
const removeHand = (item: {[key:string]: any}, editor:any) => {
  const domUtils = window.baidu.editor.dom.domUtils;
  setTimeout(() => {
    let loader = editor.document.getElementById(item.id);
    if (!loader) return;
    loader = loader.parentNode;
    loader && domUtils.remove(loader);
    editor.execCommand('inserthtml', '');
  }, 200);
}
// 错误处理
const errorHandler = (title:string, loadingId:string, filetype: string, editor:any) => {
  removeHand({id: loadingId, type: filetype }, editor);
  setTimeout(() => {
    editor.fireEvent('showmessage', {
      'id': loadingId,
      'content': title,
      'type': 'error',
      'timeout': 4000
    });
  }, 200);
}
// 成功处理
const successHandler = (filetype:string, link:string, info:any, file:any, loadingId: string, editor:any) => {
  let loader = editor.document.getElementById(loadingId);
  const rng = editor.selection.getRange();
  const bk = rng.createBookmark();
  rng.selectNode(loader).select();
  editor.execCommand('insertfile', {'url': link});
  rng.moveToBookmark(bk).select();
  editor.execCommand('inserthtml', '');
}

export default function addAttachmentBtn (options: {onclick?:(editor:{[key:string]: any}) => void, index:number, [key:string]: any}) {
  window.temporaryStorage[options.id]['addAttachmentBtn'] = options;
  // 配置上传附件添加选文件功能
  if (typeof window.temporaryStorage[options.id].uploadHand === 'function') {
    window.temporaryStorage[options.id]['addAttachmentBtn'].uploadHand = (editor:any, editorid:string) => {
      const oldInput:any = document.querySelector(`#attachment_${editorid}`);
      if (oldInput) {
        oldInput.value = '';
        oldInput.click();
        return;
      }
      const uploadFileFun = window.temporaryStorage[editorid].uploadHand;
      let inputFile = document.createElement('input');
      inputFile.id = `attachment_${editorid}`;
      inputFile.type = 'file';
      inputFile.style.height = '0px';
      inputFile.style.width = '0px';
      inputFile.style.opacity = '0';
      inputFile.style.position = 'fixed';
      inputFile.style.top = '-1000px';
      inputFile.setAttribute('multiple', 'multiple');
      inputFile.onchange = (event) => {
        const files = getFiles(event);
        if (files.length == 0) return;
        let loadingId = '';
        let uploadFileList:any = [];
        files.forEach((file:any) => {
          let loadingHtml = '';
          loadingId = 'loading_' + (+new Date()).toString(36);
          const filetype = /image\/\w+/i.test(file.type) ? 'image':'file';
          const maxSize = editor.getOpt(filetype + 'MaxSize');
          loadingHtml = '<p>' +
              '<img class="loadingclass" id="' + loadingId + '" src="' +
              editor.options.themePath + editor.options.theme +
              '/images/spacer.gif" title="' + (editor.getLang('autoupload.loading') || '') + '" >' +
              '</p>';
          /* 插入loading的占位符 */
          editor.execCommand('inserthtml', loadingHtml);
          /* 判断文件大小是否超出限制 */
          if(maxSize && file.size > maxSize) {
            errorHandler(editor.getLang('autoupload.exceedSizeError'), loadingId, filetype, editor);
            return;
          }
          const allowFiles = window.temporaryStorage[editorid].allowFiles || [];
          const fileext = file.name ? file.name.substr(file.name.lastIndexOf('.')):'';
          const allowFileSuffix = allowFiles.map((suffix:string) => `.${suffix.toLowerCase()}`);
          /* 判断文件格式是否超出允许 */
          if (!fileext || (filetype == 'file' && !allowFileSuffix.includes(fileext.toLowerCase()))) {
            errorHandler(`${editor.getLang('autoupload.exceedTypeError')}`, loadingId, filetype, editor);
            return;
          }
          // 
          uploadFileList.push(() => {
            return new Promise((resolve) => {
              const uptype = filetype;
              const id = loadingId;
              uploadFileFun(file).then((res:{url: string, name?: string, [key:string]:any} | string) => {
                if (typeof res !== 'string') {
                  resolve({ success: true, link: res.url, info: res, file: file, filetype: uptype, loadingId: id });
                } else {
                  resolve({ success: true, link: res, info: {}, file: file, filetype: uptype, loadingId: id });
                }
              }).catch((msg:string) => {
                resolve({ success: false, file: file, msg: msg || '上传失败!', filetype: uptype, loadingId: id });
              })
            })
          })
        });
        // 上传
        common.allSettled(uploadFileList).then((arr) => {
          arr.forEach(res => {
            if (res.status === 'fulfilled') {
              if (res.value.success && !!res.value.link) {
                successHandler(res.value.filetype, res.value.link, res.value.info, res.value.file, res.value.loadingId, editor);
              } else {
                console.error(`文件 ${res.value.file.name} 上传失败: ${res.value.msg}`);
                // successHandler(res.value.filetype, `../${res.value.file.name}`, res.value.info, res.value.file, res.value.loadingId, editor);
                errorHandler(`"${res.value.file.name}"上传失败: ${res.value.msg}`, res.value.loadingId, res.value.filetype, editor);
              }
            }
          })
        }).catch((error) => {
          console.error(error || '文件上传失败!');
        });
      }
      document.querySelector('body')?.appendChild(inputFile);
      inputFile.click();
    }
  }
  // 按钮注册
  window.UE.registerUI('custom-attachment', (editor:any, uiName:any) => {
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
      title: '附件',
      // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
      cssRules: "background-position: -620px -40px",
      // 点击时执行的命令
      onclick: () => {
        const editorid = parents(editor.container, '[editorid]').getAttribute('editorid');
        const current = window.temporaryStorage[editorid]['addAttachmentBtn'];
        // 判断是否配置获取列表文件方法
        if (typeof window.temporaryStorage[editorid].uploadHand !== 'function') {
          current.global.$message.warning({
            message: '该功能后端未配置！',
            'showClose': true
          });
          return;
        }
        current.onclick ? current.onclick(editor) : current.uploadHand(editor, editorid);
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
