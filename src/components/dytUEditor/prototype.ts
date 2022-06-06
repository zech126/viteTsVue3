import { parents } from './tool';
export default function prototype () {
  window.UE.Editor.prototype.loadServerConfig = function(){
    const me = this;
    setTimeout(() =>{
      const uploadFileFun = window.temporaryStorage[parents(`#${me.key}`, '[editorid]').getAttribute('editorid')].uploadHand;
      me._serverConfigLoaded = !!me.key ? typeof uploadFileFun === 'function' : true;
    })
  };
}