import common from "@/utils/common";

const getFileIcon = (url:string) => {
  const ext = url.substring(url.lastIndexOf('.') + 1, url.length).toLowerCase();
  const maps = {
    "rar":"icon_rar.gif",
    "zip":"icon_rar.gif",
    "tar":"icon_rar.gif",
    "gz":"icon_rar.gif",
    "bz2":"icon_rar.gif",
    "doc":"icon_doc.gif",
    "docx":"icon_doc.gif",
    "pdf":"icon_pdf.gif",
    "mp3":"icon_mp3.gif",
    "xls":"icon_xls.gif",
    "chm":"icon_chm.gif",
    "ppt":"icon_ppt.gif",
    "pptx":"icon_ppt.gif",
    "avi":"icon_mv.gif",
    "rmvb":"icon_mv.gif",
    "wmv":"icon_mv.gif",
    "flv":"icon_mv.gif",
    "swf":"icon_mv.gif",
    "rm":"icon_mv.gif",
    "exe":"icon_exe.gif",
    "psd":"icon_psd.gif",
    "txt":"icon_txt.gif",
    "jpg":"icon_jpg.gif",
    "png":"icon_jpg.gif",
    "jpeg":"icon_jpg.gif",
    "gif":"icon_jpg.gif",
    "ico":"icon_jpg.gif",
    "bmp":"icon_jpg.gif"
  }
  return maps[ext] ? maps[ext]:maps['txt'];
}

// const fileDown = (url:string) => {
//   console.log('点击下载文件')
// }

export default function insertfile () {
  // 覆盖自动上传功能
  window.UE.plugin.register('insertfile', function() {
    // @ts-ignore
    const me = this;
    const style = 'font-size:12px; color:#0066cc; cursor:pointer;';
    return {
      commands:{
        'insertfile': {
          execCommand: (command:any, files:Array<{url: string, [i:string]: any}> | {url: string, [i:string]: any}) => {
            const filelist = common.isArray(files) ? files : [files];
            let icon;
            let title;
            let html = '';
            const URL = me.getOpt('UEDITOR_HOME_URL') as string;
            const iconDir = URL + (URL.substring(URL.length - 1, URL.length) == '/' ? '':'/') + 'dialogs/attachment/fileTypeImages/';
            filelist.forEach((item, i) => {
              icon = iconDir + getFileIcon(item.url);
              title = item.title || item.url.substring(item.url.lastIndexOf('/') + 1, item.url.length);
              html += '<p style="line-height: 16px;">' +
                '<img style="vertical-align: middle; margin-right: 2px;" src="'+ icon + '" _src="' + icon + '" />' +
                '<a style="'+style+'" href="'+item.url+'" title="'+title+'" target="_Blank">'+title+'</a>'+
              '</p>';
            });
            me.execCommand('insertHtml', html);
          }
        }
      }
    }
  })
}
