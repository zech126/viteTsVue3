import common from '@/utils/common';
import { BroadcastChannel } from 'broadcast-channel';

const process:ImportMetaEnv = import.meta.env;
const AUTHUrl = window.location.origin.includes('172.20.200.14') ? process.VITE_AUTH.replace('dyt.pms.com.cn', '172.20.200.14') : process.VITE_AUTH;
const newTime = new Date().getTime();

class commonTool {
  subscribe: {[key:string]:Array<(value?:any) => void>}
  authSysSub: {[key:string]:Array<(value?:any) => void>}
  broadcast: BroadcastChannel | boolean
  isLoaded: boolean
  networkTest: string // 检查认证中心服务是否可访问
  messageKey: string // 通讯 key
  clearPassTime: any
  broadcastUrl: string // 接入广播信息的地址
  homologyMessageKey: Array<string> // 同源触发的 Key
  linkAuth: string // 获取认证中心系统对应值的 key
  isIframeLoad: boolean  // iframe 是否加载完成
  iframeDemo: any
  loadingTime: number
  isCanMessage: boolean
  iframeLoadTime: number
  frequency: number
  testLoadedTime: number
  iframeLoadedTime: number
  constructor () {
    this.messageKey = process.VITE_BROADCASTKEY;
    this.broadcastUrl = `/index.html#/broadcastMessage?newTime=${newTime}`;
    this.linkAuth = 'getAuthInfoKey';
    this.clearPassTime = null;
    this.isCanMessage = false; // 是否满足跨域广播
    this.iframeLoadTime = 1000 * 60 * 2; // 测试文件或iframe加载超时时间，单位毫秒
    this.testLoadedTime = 0; // 测试文件加载时长单，位毫秒
    this.frequency = 200;  // 测试文件或iframe计数频率，单位毫秒
    this.iframeLoadedTime = 0; // iframe加载时长，单位毫秒
    this.subscribe = {};
    this.authSysSub = {};
    // this.broadcast = window.BroadcastChannel ? new window.BroadcastChannel(`${process.VITE_SYSTEMCODE}-broadcast-channel`) : false;
    // 部分浏览器不支持 window.BroadcastChannel 使用 BroadcastChannel 库， 当不支持 BroadcastChannel 时，采用监听LocalStorage 和 IndexedDB 实现通讯
    this.broadcast = new BroadcastChannel(`${process.VITE_SYSTEMCODE}-broadcast-channel`);
    this.isLoaded = false;
    this.isIframeLoad = false;
    this.loadingTime = 0;
    this.iframeDemo = null;
    this.homologyMessageKey = [];
    this.networkTest = `${window.location.protocol}//${AUTHUrl}/static/js/networkTest.js?newTime=${newTime}`;
  }
  // 判断是否能连接上中间服务
  isOpenAuth ():Promise<Boolean> {
    return new Promise((resolve) => {
      if (this.isLoaded) return resolve(true);
      const oldTest:HTMLElement | null = document.querySelector(`#test-${this.messageKey}`);
      if (!common.isEmpty(oldTest)) {
        setTimeout(() => {
          if (this.testLoadedTime > this.iframeLoadTime) {
            oldTest.remove();
            return resolve(false);
          }
          this.testLoadedTime += this.frequency;
          this.isOpenAuth().then(isPass => {
            resolve(isPass);
          })
        }, this.frequency)
        return;
      }
      let link = document.createElement('script');
      link.src = this.networkTest;
      link.id = `test-${this.messageKey}`;
      (document.head || document.body).appendChild(link);
      // 加载成功
      link.onload = () => {
        this.isLoaded = true;
        resolve(true);
        link.remove();
      }
      // 加载失败
      link.onerror = (e) => {
        this.isLoaded = false;
        resolve(false);
        link.remove();
      }
    })
  }
  // 创建 iframe
  createIframe ():Promise<HTMLElement|boolean> {
    return new Promise((resolve) => {
      const oldIframe:HTMLElement | null = document.querySelector(`#iframe-${this.messageKey}`);
      if (!common.isEmpty(oldIframe)) {
        if (this.isIframeLoad && this.isCanMessage) return resolve(oldIframe);
        setTimeout(() => {
          if (this.iframeLoadedTime > this.iframeLoadTime) {
            this.clearPassTime && clearTimeout(this.clearPassTime);
            return resolve(false)
          }
          this.iframeLoadedTime += this.frequency;
          this.createIframe().then(iframe => {
            this.clearPassTime && clearTimeout(this.clearPassTime);
            resolve(iframe);
          })
        }, this.frequency)
        return;
      }
      this.clearPassTime = setTimeout(() => {
        resolve(false);
        this.isIframeLoad = true;
      }, this.iframeLoadTime);
      // 创建 iframe 指向 认证中心
      let iframe = document.createElement('iframe');
      iframe.id = `iframe-${this.messageKey}`;
      iframe.src = `${window.location.protocol}//${AUTHUrl}${this.broadcastUrl}`;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      const authRrecordInfo = (e:MessageEvent) => { // 加载 iframe 成功后
        if (typeof e.data[`${this.messageKey}`] === 'undefined') return;
        // 解除绑定
        window.removeEventListener('message', authRrecordInfo);
        if (!e.data[`${this.messageKey}`]) return resolve(false);
        // 解除绑定
        window.removeEventListener('message', authRrecordInfo);
        this.clearPassTime && clearTimeout(this.clearPassTime);
        this.isCanMessage = true;
        this.isIframeLoad = true;
        resolve(iframe);
      }
      // 监听
      window.addEventListener('message', authRrecordInfo);
    })
  }
}
const tool = new commonTool();

export class busCtrl {
  // iframe 加载完成后返回 iframe 对象
  authLoaded ():Promise<HTMLElement|Boolean> {
    return new Promise((resolve) => {
      tool.isOpenAuth().then(res => {
        if (!res) {
          console.warn('跨域文件加载失败, 当前只能使用同源通讯');
          return resolve(false);
        }
        tool.createIframe().then(iframe => {
          if (!common.isEmpty(iframe) && !common.isBoolean(iframe)) {
            tool.iframeDemo = iframe;
          }
          resolve(iframe);
        })
      })
    })
  }
  /**
   * 认证中心连接准备完毕
   * @returns 
   */
  authReadyComplete ():Promise<boolean> {
    return new Promise((resolve) => {
      if (tool.isCanMessage && !common.isEmpty(tool.iframeDemo)) {
        return resolve(tool.isCanMessage);
      }
      this.authLoaded().then(() => {
        resolve(tool.isCanMessage);
      })
    })
  }
  /**
   * 订阅全局消息广播(支持同源跨浏览器标签，部分浏览器不支持跨标签)
   * @param key 事件 key 值
   * @param callBack 回调函数
   */
   on (key:string, callBack:(value?:any) => void) {
    if (common.isEmpty(key) || common.isEmpty(callBack)) return;
    if (common.isEmpty(tool.subscribe[key])) {
      tool.subscribe[key] = [callBack];
    } else {
      tool.subscribe[key].push(callBack);
    }
  }
  /**
   * 触发全局消息广播(支持同源跨浏览器标签，部分浏览器不支持跨标签)
   * @param key 事件 key 值
   * @param value 调用订阅事件的参数
   * @param isAstride 是否跨域跨浏览器标签进行广播（默认跨域跨浏览器标签进行广播）
   */
  emit (key:string, value?:any, isAstride?: boolean) {
    // 广播信息
    if (typeof isAstride === 'undefined' || isAstride) {
      if (!common.isBoolean(tool.broadcast)) {
        tool.broadcast.postMessage({[key]: value}); // 广播到当前源下的所有窗口
        if (tool.isCanMessage && !common.isEmpty(tool.iframeDemo)) {
          tool.homologyMessageKey.push(key);
          tool.iframeDemo.contentWindow.postMessage({key: key, value: value }, '*'); // 将信息发送到认证中心
        } else {
          this.authLoaded().then((iframe:any) => {
            if (common.isBoolean(iframe) || !iframe) return;
            tool.homologyMessageKey.push(key);
            iframe.contentWindow.postMessage({key: key, value: value }, '*'); // 将信息发送到认证中心
          });
        }
      } else {
        console.warn('当前浏览器不支持跨跨域标签通讯');
      }
    }
    if (!common.isEmpty(tool.subscribe[key])) {
      for (let i = 0, len = tool.subscribe[key].length; i < len; i++) {
        tool.subscribe[key][i](value);
      }
    }
  }
  /**
   * 通过 key 和 callBack 解除订阅全局消息广播(和 window.removeEventListener 用法相似)
   * @param key 订阅的 key
   * @param callBack 回调方法
   * @returns 
   */
  off (key:string, callBack?:(value?:any) => void) {
    if (!common.isEmpty(tool.subscribe[key])) {
      if (!common.isEmpty(callBack)) {
        tool.subscribe[key].splice(tool.subscribe[key].indexOf(callBack), 1);
      } else {
        tool.subscribe[key] = [];
      }
    }
    if (!common.isEmpty(tool.authSysSub[key])) {
      if (!common.isEmpty(callBack)) {
        tool.authSysSub[key].splice(tool.authSysSub[key].indexOf(callBack), 1);
      } else {
        tool.authSysSub[key] = [];
      }
    }
  }
  /**
   * 通过 key 获取认证中心对应的值
   * @param key 数据对应的 key
   * @param params 传递到认证中心的参数
   */
  authSysData (key: string, params?: any):Promise<any> {
    return new Promise((resolve) => {
      if (common.isEmpty(key)) return resolve(null);
      const reception = (value:any) => {
        resolve(value);
        this.off(key, reception);
      }
      if (common.isEmpty(tool.authSysSub[key])) {
        tool.authSysSub[key] = [reception];
      } else {
        tool.authSysSub[key].push(reception);
      }
      if (tool.isCanMessage && !common.isEmpty(tool.iframeDemo)) {
        tool.iframeDemo.contentWindow.postMessage({key: key, type: tool.linkAuth, value: params }, '*'); // 将信息发送到认证中心
        return;
      }
      this.authLoaded().then((iframe:any) => {
        if (common.isBoolean(iframe) || !iframe) return resolve(null);
        // 将信息发送到认证中心
        iframe.contentWindow.postMessage({key: key, type: tool.linkAuth, value: params }, '*');
      })
    })
  }
}

const bus = new busCtrl();

// 通讯监听
if (!common.isBoolean(tool.broadcast)) {
  const listenerMessage = (observer:{[key:string]:Array<(value?:any) => void>}, message:MessageEvent | {data: any}) => {
    const key = Object.keys(observer);
    const messageData = message.data || message || {};
    const messageKey = Object.keys(messageData);
    let index = -1;
    for (let i = 0, len = key.length; i < len; i++) {
      index = tool.homologyMessageKey.indexOf(key[i]);
      if (index < 0) { // 在当前源已触发过 emit 则不再触发 emit 
        for (let j = 0, len = observer[key[i]].length; j < len; j++) {
          if (!common.isEmpty(key[i]) && messageKey.includes(key[i]) && !common.isEmpty(observer[key[i]][j])) {
            observer[key[i]][j](messageData[key[i]]);
          }
        }
      } else {
        tool.homologyMessageKey.splice(index, 1);
      }
    }
  }

  bus.authLoaded().then((iframe) => {
    if (common.isBoolean(iframe) || !iframe) {
      if (common.isBoolean(tool.broadcast)) return;
      // 无法跨域情况广播
      tool.broadcast.addEventListener('message', (message) => {
        listenerMessage(tool.subscribe, message);
      });
    }
  })
  // 跨域情况广播
  window.addEventListener('message', (e:MessageEvent) => {
    if (common.isEmpty(e.data.key) || common.isBoolean(tool.broadcast)) return;
    if (e.data.type === tool.linkAuth) {
      const authKeySub = tool.authSysSub[e.data.key];
      if (common.isEmpty(authKeySub)) return;
      for (let a = 0, alen = authKeySub.length; a < alen; a++) {
        !common.isEmpty(authKeySub[a]) && authKeySub[a](e.data.value);
      }
    } else {
      tool.homologyMessageKey = [];
      listenerMessage(tool.subscribe, {data: {[e.data.key]: e.data.value}});
      tool.broadcast.postMessage({[e.data.key]: e.data.value}); // 广播到当前源下的所有窗口
    }
  })
} else {
  console.warn('当前浏览器不支持跨跨域标签通讯');
}

export default bus;