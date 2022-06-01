export default function prototype () {
  // const utils = window.baidu.editor.utils;
  // function showErrorMsg(msg:any) {
  //   console && console.error(msg);
  // }
  window.UE.Editor.prototype.loadServerConfig = function(){
    const me = this;
    setTimeout(function(){
      me._serverConfigLoaded = true;
      // try{
      //   me.options.imageUrl && me.setOpt('serverUrl', me.options.imageUrl.replace(/^(.*[\/]).+([\.].+)$/, '$1controller$2'));
      //   let configUrl = me.getActionUrl('config');
      //   let isJsonp = utils.isCrossDomainUrl(configUrl);
      //   /* 发出ajax请求 */
      //   me._serverConfigLoaded = true;
      //   configUrl && window.UE.ajax.request(configUrl,{
      //     'method': 'GET',
      //     'dataType': isJsonp ? 'jsonp':'',
      //     'onsuccess':function(r:any){
      //       try {
      //         var config = isJsonp ? r:eval("("+r.responseText+")");
      //         utils.extend(me.options, config);
      //         me.fireEvent('serverConfigLoaded');
      //         me._serverConfigLoaded = true;
      //       } catch (e) {
      //         showErrorMsg(me.getLang('loadconfigFormatError'));
      //       }
      //     },
      //     'onerror':function(){
      //       showErrorMsg(me.getLang('loadconfigHttpError'));
      //     }
      //   });
      // } catch(e){
      //   showErrorMsg(me.getLang('loadconfigError'));
      // }
    })
  };
}