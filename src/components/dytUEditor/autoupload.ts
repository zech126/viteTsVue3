import { parents } from './tool';
import common from '@/utils/common';

export default function autoupload (key:string) {
  const domUtils = window.baidu.editor.dom.domUtils;
  // const browser = window.baidu.editor.browser;
  const utils = window.baidu.editor.utils;
  // 覆盖自动上传功能
  window.UE.plugin.register('autoupload', () => {

    function getPasteImage(e:any) {
      return e.clipboardData && e.clipboardData.items && e.clipboardData.items.length == 1 && /^image\//.test(e.clipboardData.items[0].type) ? e.clipboardData.items:null;
    }
    function getDropImage(e:any) {
      return  e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files:null;
    }
    // 移除加载提示
    const removeHand = (item: {[key:string]: any}, me:any) => {
      setTimeout(() => {
        let loader = me.document.getElementById(item.id);
        if (!loader) return;
        // if (item.type !== 'image') {
        //   loader = loader.parentNode;
        // }
        loader = loader.parentNode;
        loader && domUtils.remove(loader);
        me.execCommand('inserthtml', '');
      }, 200);
    }
    // 错误处理
    const errorHandler = (title:string, loadingId:string, filetype: string, me:any) => {
      removeHand({id: loadingId, type: filetype }, me);
      setTimeout(() => {
        me.fireEvent('showmessage', {
          'id': loadingId,
          'content': title,
          'type': 'error',
          'timeout': 4000
        });
      }, 200);
    }
    // 成功处理
    const successHandler = (filetype:string, link:string, info:any, file:any, loadingId: string, me:any) => {
      if (filetype == 'image') {
        let loader = me.document.getElementById(loadingId);
        if (loader) {
          loader.setAttribute('src', link);
          loader.setAttribute('_src', link);
          loader.setAttribute('title', info.name || file.name || '');
          loader.removeAttribute('id');
          domUtils.removeClasses(loader, 'loadingclass');
        }
      } else {
        let loader = me.document.getElementById(loadingId);
        const rng = me.selection.getRange();
        const bk = rng.createBookmark();
        rng.selectNode(loader).select();
        me.execCommand('insertfile', {'url': link});
        rng.moveToBookmark(bk).select();
      }
      me.execCommand('inserthtml', '');
    }

    // 文件插入处理
    function sendAndInsertFile (files:any, me:any) {
      const editKey = parents(me.container, '[editorid]').getAttribute('editorid');
      const uploadFileFun = window.temporaryStorage[editKey].uploadHand;
      const allowFiles = window.temporaryStorage[editKey].allowFiles || [];
      let uploadFileList:any = [];
      let loadingId = '';
      files.forEach((file:any) => {
        let loadingHtml = '';
        loadingId = 'loading_' + (+new Date()).toString(36);
        const filetype = /image\/\w+/i.test(file.type) ? 'image':'file';
        const maxSize = me.getOpt(filetype + 'MaxSize');
        loadingHtml = '<p>' +
            '<img class="loadingclass" id="' + loadingId + '" src="' +
            me.options.themePath + me.options.theme +
            '/images/spacer.gif" title="' + (me.getLang('autoupload.loading') || '') + '" >' +
            '</p>';
        /* 插入loading的占位符 */
        me.execCommand('inserthtml', loadingHtml);
        // 判断是否配置上传功能
        if (typeof uploadFileFun !== 'function') {
          removeHand({id: loadingId, type: filetype }, me);
          // errorHandler('未配置上传文件功能！', loadingId, filetype, me);
          return;
        }
        /* 判断文件大小是否超出限制 */
        if(file.size > maxSize) {
          errorHandler(me.getLang('autoupload.exceedSizeError'), loadingId, filetype, me);
          return;
        }
        const fileext = file.name ? file.name.substr(file.name.lastIndexOf('.')):'';
        const allowFileSuffix = allowFiles.map((suffix:string) => `.${suffix.toLowerCase()}`);
        /* 判断文件格式是否超出允许 */
        if ((fileext && filetype != 'image') && (!allowFileSuffix.includes(fileext.toLowerCase()))) {
          errorHandler(`${me.getLang('autoupload.exceedTypeError')}`, loadingId, filetype, me);
          return;
        }
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
      common.allSettled(uploadFileList).then((arr) => {
        arr.forEach(res => {
          if (res.status === 'fulfilled') {
            if (res.value.success && !!res.value.link) {
              successHandler(res.value.filetype, res.value.link, res.value.info, res.value.file, res.value.loadingId, me);
            } else {
              console.error(`文件 ${res.value.file.name} 上传失败: ${res.value.msg}`);
              // removeHand({id: res.value.loadingId, type: res.value.filetype }, me);
              errorHandler(`"${res.value.file.name}"上传失败: ${res.value.msg}`, res.value.loadingId, res.value.filetype, me)
            }
          }
        })
      }).catch((error) => {
        console.error(error || '文件上传失败!');
      })
    }
    // 事件注册
    return {
      outputRule: (root:any) => {
        utils.each(root.getNodesByTagName('img'), (n:any) => {
          if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
            n.parentNode.removeChild(n);
          }
        });
        utils.each(root.getNodesByTagName('p'), (n:any) => {
          if (/\bloadpara\b/.test(n.getAttr('class'))) {
            n.parentNode.removeChild(n);
          }
        });
      },
      // 添加事件
      bindEvents: {
        'ready' (e:any) {
          const me:any = this;
          if(window.FormData && window.FileReader) {
            domUtils.on(me.body, 'paste drop', (e:any) => {
              let hasImg = false;
              let items;
              //获取粘贴板文件列表或者拖放文件列表
              items = e.type == 'paste' ? getPasteImage(e):getDropImage(e);
              if(items){
                // 此处可以做文件类型判断
                let len = items.length;
                let file:any;
                let needUploadFile = [];
                while (len--){
                  file = items[len];
                  if(file.getAsFile) file = file.getAsFile();
                  // 此处可写上传方法
                  if(file && file.size > 0) {
                    // 文件对象中名称不能修改，，只能创建新文件对象时传入文件名称
                    const upFile = e.type === 'paste' ? new File([file], `${(+new Date()).toString(36)}_${file.name}`, {type: file.type}) : file;
                    needUploadFile.push(upFile);
                    hasImg = true;
                  }
                }
                sendAndInsertFile(needUploadFile, me);
                hasImg && e.preventDefault();
              }
            });
            //取消拖放图片时出现的文字光标位置提示
            domUtils.on(me.body, 'dragover', (e:any) => {
              if(e.dataTransfer.types[0] == 'Files') {
                e.preventDefault();
              }
            });
          }
        }
      }
    }
  })
}
