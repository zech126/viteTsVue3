import { parents } from './tool';

export default function simpleupload (key: string) {
  const domUtils = window.baidu.editor.dom.domUtils;
  // const browser = window.baidu.editor.browser;
  const utils = window.baidu.editor.utils;
  // 覆盖自动上传功能
  window.UE.plugin.register('simpleupload', function () {
    // @ts-ignore
    const me:any = this;
    let isLoaded = false;
    let containerBtn:any;
    function initUploadBtn(){
      // 上传文件方法
      const uploadFileFun = window.temporaryStorage[parents(me.container, '[editorid]').getAttribute('editorid')].uploadHand;
      const timestrap = (+new Date()).toString(36);
      let w = containerBtn.offsetWidth || 20;
      let h = containerBtn.offsetHeight || 20;
      let btnIframe:any = document.createElement('iframe');
      // btnIframe.id = `edui_iframe_${timestrap}`;
      let btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;';

      domUtils.on(btnIframe, 'load', function(){
        let wrapper;
        let btnIframeDoc;
        let btnIframeBody;
        btnIframeDoc = (btnIframe.contentDocument || btnIframe.contentWindow.document);
        btnIframeBody = btnIframeDoc.body;
        wrapper = btnIframeDoc.createElement('div');

        wrapper.innerHTML = `<form id="edui_form_${timestrap}" enctype="multipart/form-data" style="${btnStyle}">
          <input id="edui_input_${timestrap}" type="file" accept="image/*" name="${me.options.imageFieldName}" style="${btnStyle}">
        </form>`;

        wrapper.className = 'edui-' + me.options.theme;
        wrapper.id = me.ui.id + '_iframeupload';
        btnIframeBody.style.cssText = btnStyle;
        btnIframeBody.style.width = w + 'px';
        btnIframeBody.style.height = h + 'px';
        btnIframeBody.appendChild(wrapper);

        if (btnIframeBody.parentNode) {
          btnIframeBody.parentNode.style.width = w + 'px';
          btnIframeBody.parentNode.style.height = w + 'px';
        }

        const form = btnIframeDoc.getElementById('edui_form_' + timestrap);
        const input = btnIframeDoc.getElementById('edui_input_' + timestrap);
        // const iframe = window.document.getElementById(`edui_iframe_${timestrap}`);
        
        // 错误处理
        const errorHandler = (title:any, loadingId:string) => {
          loadingId && setTimeout(() => {
            const loader = me.document.getElementById(loadingId);
            loader && domUtils.remove(loader);
            me.execCommand('inserthtml', '');
          }, 200);
          me.fireEvent('showmessage', {
            'id': loadingId,
            'content': title,
            'type': 'error',
            'timeout': 4000
          });
        };
        domUtils.on(input, 'change', function(){
          const filename = input.value;
          const files = input.files[0];
          // 重置表单
          form.reset();
          if(!filename) return;
          const loadingId = 'loading_' + (+new Date()).toString(36);
          me.focus();
          me.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '"'+
          ' src="' + me.options.themePath + me.options.theme +'/images/spacer.gif"'+
          ' title="' + (me.getLang('simpleupload.loading') || '') + '" />');
          
          // 判断是否配置上传功能
          if (typeof uploadFileFun !== 'function' || !me._serverConfigLoaded) {
            errorHandler('未配置上传文件功能！', loadingId);
            return;
          }
          const fileext = filename ? filename.substr(filename.lastIndexOf('.')):'';
          const filetype = /image\/\w+/i.test(files.type) ? 'image':'file';
          // 判断文件格式是否错误
          if (!fileext || filetype !== 'image') {
            errorHandler(`${me.getLang('simpleupload.exceedTypeError')}, 请选择图片格式的文件`, loadingId);
            return;
          }
          // 执行图片上传操作
          uploadFileFun(files).then((res:{url: string, name?: string, [key:string]:any} | string) => {
            let loader = me.document.getElementById(loadingId);
            if (typeof res !== 'string') {
              loader.setAttribute('src', res.url);
              loader.setAttribute('_src', res.url);
              loader.setAttribute('title', res.name || files.name || '');
            } else {
              loader.setAttribute('src', res);
              loader.setAttribute('_src', res);
              loader.setAttribute('title', files.name || '');
            }
            loader.removeAttribute('id');
            domUtils.removeClasses(loader, 'loadingclass');
            me.execCommand('inserthtml', '');
          }).catch((msg:string) => {
            errorHandler(`图片上传失败: ${msg}`, loadingId);
          });
        });

        let stateTimer:any;
        me.addListener('selectionchange', function () {
          clearTimeout(stateTimer);
          stateTimer = setTimeout(function() {
            var state = me.queryCommandState('simpleupload');
            if (state == -1) {
              input.disabled = 'disabled';
            } else {
              input.disabled = false;
            }
          }, 400);
        });
        isLoaded = true;
      });

      btnIframe.style.cssText = btnStyle;
      containerBtn.appendChild(btnIframe);
    }

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
        'ready' () {
          //设置loading的样式
          utils.cssRule('loading',
          '.loadingclass{display:inline-block;cursor:default;background: url(\''
          + me.options.themePath
          + me.options.theme +'/images/loading.gif\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\n' +
          '.loaderrorclass{display:inline-block;cursor:default;background: url(\''
          + me.options.themePath
          + me.options.theme +'/images/loaderror.png\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;' +
          '}',
          me.document);
        },
        /* 初始化简单上传按钮 */
        'simpleuploadbtnready' (type:any, container:any) {
          containerBtn = container;
          me.afterConfigReady(initUploadBtn);
        },
        outputRule (root:any) {
          utils.each(root.getNodesByTagName('img'),function(n:any){
            if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
              n.parentNode.removeChild(n);
            }
          });
        },
        commands: {
          'simpleupload': {
            queryCommandState: function () {
              return isLoaded ? 0:-1;
            }
          }
        }
      }
    }
  })
}
