import Cookies from 'js-cookie';
import store from '@/store';
import {
  debounce, throttle, cloneDeep, isArray, isObject, isNumber, isString, isBoolean, isFunction, isDate, isRegExp, isSymbol,
  isSet
} from 'lodash';
import axios from 'axios';
import dayjs from 'dayjs';
class commonTool {
  /**
   * 下载操作
   * @param fileRes 数据源
   * @param fileName 文件名
   * @param timestamp 是否在文件后追加时间戳
   * @param suffix 文件后缀名
   * @returns 
   */
  downLoadHand (fileRes:Blob, fileName:string, timestamp = false, suffix?:string) {
    return new Promise((resolve, reject) => {
      try {
        //  如果支持微软的文件下载方式(ie10+浏览器)
        // @ts-ignore
        if (window.navigator.msSaveBlob) {
          // @ts-ignore
          window.navigator.msSaveBlob(fileRes, fileName + (timestamp ? `_${Date.now()}` : '') + (suffix?`.${suffix}`:''));
        } else {
          // 其他浏览器
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(fileRes);
          a.style.display = 'none';
          a.setAttribute('download', fileName + (timestamp ? `_${Date.now()}` : '') + (suffix?`.${suffix}`:''));
          setTimeout(() => {
            a.click();
            setTimeout(() => {
              a.remove();
              resolve(true);
              // 释放缓存
              window.URL.revokeObjectURL(a.href);
            }, 10)
          }, 0)
        }
      } catch (error) {
        console.error('浏览器不支持！');
        reject(error);
      }
    })
  }
  // base64 转换为 UintArr
  getUintArr (base64Data:string) {
    const isIncludesSign = (/^data:/.test(base64Data) && base64Data.includes(';base64,'));
    const arr:Array<string> = base64Data.split(',');
    const match = isIncludesSign ? arr[0].match(/:(.*?);/) : [];
    const newFileType = match && match.length > 1 ? match[1] : '';
    try{
      let bstr = window.atob(isIncludesSign ? arr[1] : arr[0]);
      let leng = bstr.length;
      let UintArr = new Uint8Array(leng);
      while(leng--){
        UintArr[leng] = bstr.charCodeAt(leng);
      }
      return { type: newFileType, Uint8Array: UintArr }
    }catch(e){
      console.warn('数据源格式有误, 可能会丢失部分数据:', e);
      return { type: newFileType, Uint8Array: base64Data }
    }
  }
  /**
   * 返回本地时间与标准时间的时差(正数为东区，负数为西区)
   * @returns 
   */
  getTimeDifference () {
    const nowDate = new Date();
    const dateISO = nowDate.toISOString().split(/[^0-9]/);
    const dateLocale = nowDate.toLocaleString().split(/[^0-9]/);
    return Number(dateLocale[3]) - Number(dateISO[3]);
  }
  /**
 * 最多执行异步方法数量
 * @param concurrency 数据源
 * @param limit 并发最大数量, 默认 10
 * @returns 
 */
  enqueuePromise (concurrency:Array<Function> = [], {limit = 10, progress = (percent:number) => {} } = {}): Promise<Array<any>> {
    let index = 0;
    const ret:Array<any> = [];
    const executing:Array<any> = [];
    const poolLimit = limit > 0 ? limit : 10;
    const enqueue = ():Promise<unknown> => {
      // 边界处理, concurrency 为空数组
      if (index === concurrency.length) {
        concurrency.length === 0 && progress(100);
        return Promise.resolve();
      }
      // 每调一次 enqueue, 初始化一个 promise
      let newPromise = concurrency[index++]();
      if (Object.prototype.toString.call(newPromise).slice(8, -1) !== 'Promise') {
        if (isFunction(newPromise)) {
          newPromise = newPromise();
          if (Object.prototype.toString.call(newPromise).slice(8, -1) !== 'Promise') {
            newPromise = Promise.resolve(newPromise);
          }
        } else {
          newPromise = Promise.resolve(newPromise);
        }
      }
      progress(Number(((index / concurrency.length) * 100).toFixed(2)));
      // 放入 promises 数组
      ret.push(newPromise);
      // 将有返回值的 promise 从 executing 数组中删除, 并将下一个需要执行的放进 executing 数组中
      const perform:any = newPromise.then(() => {
        return executing.splice(executing.indexOf(perform), 1);
      }).catch(() => {
        return executing.splice(executing.indexOf(perform), 1);
      });
      // 插入 executing 数组, 表示正在执行的 promise
      executing.push(perform);
      // 使用 Promise.rece, 每当 executing 数组中 promise 数量低于 poolLimit, 就实例化新的 promise 并执行
      let result = Promise.resolve();
      if (executing.length >= poolLimit) {
        result = Promise.race(executing);
      }
      // 递归, 直到遍历完 concurrency
      return result.then(() => enqueue());
    };
    return enqueue().then(() => ret);
  }
}
const tool = new commonTool();
export class commonClass {
  // 防抖
  debounce: typeof debounce;
  throttle: typeof throttle;
  copy: typeof cloneDeep;
  isArray: typeof isArray;
  isObject: typeof isObject;
  isNumber: typeof isNumber;
  isString: typeof isString;
  isBoolean: typeof isBoolean;
  isFunction: typeof isFunction;
  isDate: typeof isDate;
  isRegExp: typeof isRegExp;
  isSymbol: typeof isSymbol;
  isSet: typeof isSet;
  constructor() {
    this.debounce = debounce; // 防抖
    this.throttle = throttle; // 节流
    this.copy = cloneDeep; // 深拷贝
    this.isArray = isArray; // 是否数组
    this.isObject = isObject; // 是否对象
    this.isNumber = isNumber; // 是否数字
    this.isString = isString; // 是否字符串
    this.isBoolean = isBoolean; // 是否布尔值
    this.isFunction = isFunction; // 是否函数
    this.isDate = isDate; // 是否日期
    this.isRegExp = isRegExp; // 是否正则
    this.isSymbol = isSymbol; // 是否为 Symbol
    this.isSet = isSet; // 是否为 Set
  }
  /**
   * 是否文件类型
   * @param value 
   * @returns 
   */
  isFile (value:any):value is File {
    return Object.prototype.toString.call(value).slice(8, -1) === 'File';
  }
  /**
   * 是否为 undefined
   * @param value 
   * @returns 
   */
  isUndefined (value:any):value is undefined {
    return typeof value === 'undefined'
  }
  /**
   * 是否Promise对象
   * @param value 
   * @returns 
   */
  isPromise (value:any):value is Promise<any> {
    return Object.prototype.toString.call(value).slice(8, -1) === 'Promise'
  }
  /**
   * 是否 Blob 类型 
   * @param value 数据源
   * @returns 
   */
  isBlob  (value:any):value is Blob {
    return Object.prototype.toString.call(value).slice(8, -1) === 'Blob'
  }
  /**
   * 是否 json
   * @param value 
   * @returns 
   */
  isJson (value:any): value is JSON {
    return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
  }
  /**
   * 判断是否为空, 可以支持判断 空数组、空对象、null、空字符串、undefined、NaN
   * @param value 需要验证的数据
   * @param type 多个空格或数组、对象末级递归至父级是否视为空值
   * @returns 
   */
  isEmpty (value?:any, type = false):value is null | undefined {
    if (this.isDate(value)) return isNaN(value.getTime());
    if (this.isString(value)) {
      return this.isBoolean(type) && type ? value.trim() === '' : value === '';
    }
    if (this.isNumber(value)) return isNaN(value);
    if (this.isJson(value) || this.isArray(value)) {
      const arr = Object.values(value);
      if (!type) return arr.length <= 0;
      return Object.keys(this.removeEmpty(arr, true)).length <= 0;
    }
    return value === null || this.isUndefined(value);
  }
  /**
   * 数组去重
   * @param value 转换目标数组
   * @returns 
   */
  arrRemoveRepeat (value:Array<any>):typeof value {
    return Array.from(new Set(value));
  }
  /**
   * 多维数组扁平化
   * @param val 转换目标数组
   * @returns 
   */
  flat (value:Array<any>):typeof value {
    return value.flat(Infinity);
  }
  /**
   * 判断手机是Andoird还是IOS
   * @returns 
   */
  getOSType (): string {
    const u = navigator.userAgent;
    // const app = navigator.appVersion;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'other';
  }
  /**
   * 滚动到指定元素位置
   * @param element 目标元素
   */
  smoothScroll (element:string | HTMLElement) {
    const newElement = this.isString(element) ? document.querySelector(element) as HTMLElement : element;
    newElement.scrollIntoView({
      behavior: 'smooth'
    });
  }
  /**
 *
 * @param {string|Blob|Array} data 数据源, 可以是文件的地址、base64、File等, 必传
 * @param {object} options
 * @param {string} options.fileName 文件名
 * @param {string} options.suffix 文件名后缀
 * @param {string} options.type MIME类型，尽量传入正确的类型
 * @param {string} options.encode 字符编码类型
 * @param {boolean} options.timestamp 是否在文件名后追加时间戳
 */
  downloadFile (data:string|Blob|File, {name = '', suffix = '', type = '', encode = '', timestamp = false } = {}) {
    return new Promise((resolve, reject) => {
      if (!data) {
        console.error(`数据源不能为空！`);
        reject('数据源不能为空！');
        return;
      }
      if (this.isString(data) && /^https?|ftp|data:/.test(data)) {
        // 数据源为 base64 数据源时
        if (/^data:/.test(data)) {
          tool.downLoadHand(this.base64ToBlob(data), name, timestamp, suffix).then(() => {
            resolve(true);
          }).catch((error) => {
            reject(error);
          })
          return;
        }
        // 数据源为地址时
        axios.get(data, {
          responseType: 'blob',
          // headers: {
          //   withCredentials: true
          // }
        }).then(res => {
          let newName = decodeURI(data.substring(data.indexOf('=') + 1, data.lastIndexOf('.')));
          newName = newName.substring(newName.lastIndexOf('/') + 1, newName.length);
          const newSuffix:string = data.substring(data.lastIndexOf('.') + 1, data.length);
          this.downloadFile(res.data, {
            name: name || newName,
            suffix: suffix || (!this.isEmpty(newSuffix) && newSuffix.length > 4 ? '' : newSuffix),
            timestamp: timestamp,
            encode: encode,
            type: type
          }).then((result) => {
            resolve(result);
          }).catch((error) => {
            reject(error);
          })
        }).catch(() => {
          console.error(`无法获取文件内容，请检查本地网络或文件地址: ${decodeURI(data)} 是否能正常打开`);
        })
        return;
      }
      const isFile = this.isFile(data);
      // 数据源为file格式或文件流时
      let blob = (this.isBlob(data) || isFile) ? data : new Blob(this.isArray(data) ? data : [data]);
      if (!this.isEmpty(type) || !this.isEmpty(encode)) {
        const options = {
          type: (type || 'text/plain') + (encode ? ';charset=' + encode : 'utf-8')
        }
        blob = this.isBlob(data) ? data : new Blob(this.isArray(data) ? data : [data], options);
      }
      tool.downLoadHand(blob, isFile ? name || data.name : name, timestamp, suffix).then(() => {
        resolve(true);
      }).catch((error) => {
        reject(error);
      })
    })
  }
  /**
   * 将字符串分割成数组
   * @param str 需要分割的字符串
   * @param sign 分割符号，支持字符串、数组、RegExp; (注意：正则特殊符号不要放到数组中，请使用字符串)
   * @param removeEmpty 是否移除空值以及空格
   * @returns 
   */
  split (str:string, sign?:Array<string>|string|RegExp, removeEmpty?:boolean):Array<string> {
    if (this.isEmpty(str) || !this.isString(str)) return [];
    if (this.isRegExp(sign)) return str.split(sign);
    if (this.isEmpty(sign) || (!this.isString(sign) && !this.isArray(sign))) return [str];
    const isRemove = this.isBoolean(removeEmpty) && removeEmpty;
    if (this.isString(sign)) {
      if (isRemove) return str.split(sign).filter(f => !this.isEmpty(f, true));
      return str.split(sign);
    }
    let strArr:Array<string> = [];
    let newArr:Array<Array<string>|string> = [];
    for (let si = 0, slen = sign.length; si < slen; si++) {
      if (si === 0) {
        strArr = isRemove ? str.split(sign[si]).filter(f => !this.isEmpty(f, true)) : str.split(sign[si]);
      } else {
        newArr = [];
        for (let i = 0, len = strArr.length; i < len; i++) {
          newArr.push(isRemove ? strArr[i].split(sign[si]).filter(f => !this.isEmpty(f, true)) : strArr[i].split(sign[si]));
        }
        strArr = this.flat(newArr);
      }
    }
    return strArr;
  }
  /**
   * 移除对象中所有为字符串的值 2 端空格， 不影响原数据
   * @param target 需处理的数据对象
   * @param ruleOut 不处理的键名, 包括所在的所有子级, 可以指定对象数据链，如果是数组: a.b.c[3].d.g[2].key, 数组下所有元素则用 * 号代替数字: a.b.c[\*].d.g[\*].key
   * @returns 
   */
  trim (target:string | {[key:string]:any} | Array<any>, ruleOut?:string | Array<string>):typeof target {
    if (!this.isString(target) && !this.isArray(target) && !this.isJson(target)) return target;
    const outKey = !this.isEmpty(ruleOut) ? (this.isString(ruleOut) ? [ruleOut] : this.isArray(ruleOut) ? ruleOut : []) : [];
    const hand = (obj:string | {[key:string]:any} | Array<any>, stackPointerLike?:string):typeof obj => {
      if (this.isString(obj)) return obj.trim();
      if (!this.isJson(obj) && this.isArray(obj)) return obj;
      let backVal;
      if (this.isArray(obj)) {
        backVal = [];
        for(let index = 0, len = obj.length; index < len; index++) {
          let currentLikeKey = `${this.isEmpty(stackPointerLike)?'':stackPointerLike}[*]`;
          const otherLikeKey = `${this.isEmpty(stackPointerLike)?'':stackPointerLike}[${index}]`;
          for (let oi = 0, olen = outKey.length; oi < olen; oi++) {
            if (outKey[oi].includes(otherLikeKey)) {
              const newStr = outKey[oi].substring(0, otherLikeKey.length);
              newStr === otherLikeKey && (currentLikeKey = newStr);
            }
          }
          if (!outKey.includes(currentLikeKey)) {
            if (this.isJson(obj[index]) || this.isArray(obj[index])) {
              backVal.push(hand(obj[index], currentLikeKey))
            } else {
              this.isString(obj[index]) ? backVal.push(obj[index].trim()) : backVal.push(obj[index]);
            }
          } else {
            backVal.push(obj[index]);
          }
        }
      } else if (this.isJson(obj)) {
        backVal = {};
        const objKeys = Object.keys(obj);
        for(let index = 0, len = objKeys.length; index < len; index++) {
          const currentLikeKey = `${this.isEmpty(stackPointerLike) ? '' : `${stackPointerLike}.`}${objKeys[index]}`;
          if (!outKey.includes(objKeys[index]) && !outKey.includes(currentLikeKey)) {
            if (this.isJson(obj[objKeys[index]]) || this.isArray(obj[objKeys[index]])) {
              backVal[objKeys[index]] = hand(obj[objKeys[index]], currentLikeKey);
            } else {
              backVal[objKeys[index]] = this.isString(obj[objKeys[index]]) ? obj[objKeys[index]].trim() : obj[objKeys[index]];
            }
          } else {
            backVal[objKeys[index]] = obj[objKeys[index]];
          }
        }
      }
      return backVal as string | {[key:string]:any} | Array<any>;
    }
    return hand(this.copy(target));
  }
  getParams (obj:{[key:string]:string}):string {
    if (this.isJson(obj)) {
      const keys = Object.keys(obj);
      let params = '';
      keys.forEach(key => {
        params += params.includes('=')?`&${key}=${obj[key] }`:`${key}=${obj[key] }`;
      })
      return params;
    }
    return ''
  }
  /**
   * 获取全部url参数,并转换成json对象
   * @param config 目标对象
   * @returns 
   */
  getUrlParams (config?:{url?:string, keys?: Array<string> | string} | string, key?:Array<string> | string):string | {[key:string]:string} | Array<{[key:string]:string}> {
    const newUrl = decodeURIComponent((this.isString(config) ? config : config ? config.url : window.location.href) || window.location.href);
    if (newUrl.indexOf('?') === -1) return {};
    const urlOption = newUrl.substring(newUrl.indexOf('?') + 1);
    const urlList = this.split(urlOption, ['&']);
    let urlJson:{[key:string]:string} = {};
    const keysList = !this.isEmpty(key) ? key : this.isObject(config) && !this.isEmpty(config.keys) ? config.keys : null;
    for (let i = 0, len = urlList.length; i < len; i++) {
      const pos = urlList[i].indexOf('=');
      urlJson[urlList[i].substring(0, pos)] = urlList[i].substring(pos + 1);
    }
    if (this.isString(keysList)) {
      return urlJson[keysList];
    } else if (this.isArray(keysList)) {
      let newVal = {};
      for (let index = 0, klen = keysList.length; index < klen; index++) {
        newVal[keysList[index]] = urlJson[keysList[index]];
      }
      return newVal;
    }
    return urlJson;
  }
  /**
   * 复制到粘贴板上
   * @param content 需要复制的字符串或JSON
   * @returns 
   */
  copyToClip (content:any): Promise<any> {
    const copyTxt = this.isJson(content) ? JSON.stringify(content) : content;
    return new Promise(resolve => {
      // execCommand 方法有可能弃用，，
      if (document.execCommand) {
        let staging = document.createElement('textarea');
        staging.innerHTML = copyTxt;
        document.body.appendChild(staging);
        staging.style.position = 'absolute';
        staging.style.maxHeight = '30vh';
        staging.style.maxWidth = '30vw';
        staging.style.top = '-1000vh';
        staging.style.left = '1000vw';
        staging.select();
        document.execCommand('copy');
        document.body.removeChild(staging);
        resolve(true);
      } else {
        console.error('浏览器不支持该操作');
        resolve(false);
      }
    })
  }
  /**
   * base64 转为 Blob
   * @param base64Data 数据源
   * @returns 
   */
   base64ToBlob (base64Data:string, fileType?:string): Blob {
    const uintArr = tool.getUintArr(base64Data);
    return new Blob([uintArr.Uint8Array], {type: fileType || uintArr.type || 'text/plain' });
  }
  /**
   * 文件格式转为 base64
   * @param file 
   * @returns 
   */
  fileToBase64 (file:Blob | File): Promise<string> {
    return new Promise((reslove,reject) => {
      let oFileReader = new FileReader();
      oFileReader.onloadend = (e) => {
        if (this.isEmpty(e.target)) return reject(e);
        reslove(e.target.result as string);
      };
      oFileReader.readAsDataURL(file);
    })
  }
  /**
   * 转为文件格式
   * @param dataOrigin 数据源, 支持 base64、blob 格式
   * @param fileName 文件名
   * @param fileType 文件类型
   * @returns 
   */
  base64ToFile (dataOrigin:string, fileName:string, fileType?: string): File {
    const uintArr = this.isBlob(dataOrigin) ? {Uint8Array: dataOrigin, type: fileType} : tool.getUintArr(dataOrigin);
    const type = fileType || uintArr.type;
    return this.isEmpty(type) ? new File([uintArr.Uint8Array], fileName) : new File([uintArr.Uint8Array], fileName, {
      type: type
    });
  }
  /**
   * 转为文件格式
   * @param dataOrigin 数据源, 支持 base64、blob 格式
   * @param fileName 文件名
   * @param fileType 文件类型
   * @returns 
   */
  spannedFile (dataOrigin:string, fileName:string, fileType?: string): File {
    return this.base64ToFile(dataOrigin, fileName, fileType);
  }
  /**
   * blob 转为 Base64
   * @param blob 数据源
   * @returns 
   */
  blobToBase64 (blob:Blob) {
    return new Promise((resolve, reject) => {
      if (this.isEmpty(blob)) return reject({message: '数据源不可为空'});
      if (!this.isBlob(blob)) return reject({
        message: '数据源格式有误，请传递 blob 格式的数据源'
      });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })
  }
  /**
   * 获取cookie, 支持数组和json
   * @param keys 需要获取 cookie 的key
   * @returns 
   */
  getCookie (keys:string | Array<string> | {[key:string]: string}):string | {[key:string]: string} {
    if (this.isJson(keys) || this.isArray(keys)) {
      let newVal:string | {[key:string]: string} = {};
      if (this.isJson(keys)) {
        const objKey = Object.keys(keys);
        for(let index = 0, len = objKey.length; index < len; index++) {
          newVal[objKey[index]] = Cookies.get(keys[objKey[index]]) || '';
        }
      } else if (this.isArray(keys)) {
        for(let i = 0, klen = keys.length; i < klen; i++) {
          newVal[keys[i]] = Cookies.get(keys[i]) || '';
        }
      }
      return newVal;
    }
    return this.isString(keys) ? (Cookies.get(keys) || '') : '';
  }
  /**
   * 插入cookie，支持数组和json
   * @param key 插入cookie 的key，此处可以是数组，json
   * @param val cookie 的值(当 key 为数据或对象时，此参数会被忽略)
   * @param expires cookie 的过期时间和以前设置(当 key 为数据或对象时，此参数会被忽略)
   * @returns 
   */
  setCookie (
    key:string | Array<{
      key: string, value: string, expires?: {[key:string]: any}
    }> | {
      key: string, value: string, expires?: {[key:string]: any}
    }, val?:string, expires?: {[key:string]: any}
  ) {
    if (this.isEmpty(key)) return;
    if (this.isJson(key)) {
      const keys = Object.keys(key);
      for(let i = 0, len = keys.length; i < len; i++) {
        if(!this.isEmpty(key[keys[i]].key) && !this.isEmpty(key[keys[i]].value)) {
          Cookies.set(key[keys[i]].key, key[keys[i]].value, key[keys[i]].expires || {});
        }
      }
    } else if (this.isArray(key)) {
      for(let i = 0, len = key.length; i < len; i++) {
        if(!this.isEmpty(key[i].key) && !this.isEmpty(key[i].value)) {
          Cookies.set(key[i].key, key[i].value, key[i].expires || {});
        }
      }
    } else if(this.isString(key) && !this.isUndefined(val)){
      Cookies.set(key, val, expires||{});
    }
  }
  /**
   * 移除,支持数组
   * @param keys 需要移除 cookie 的 key
   * @returns 
   */
  delCookie (keys:string | Array<string>) {
    if (this.isEmpty(keys)) return;
    if (this.isString(keys)) {
      Cookies.remove(keys);
    } else if (this.isArray(keys)) {
      for(let i = 0, len = keys.length; i < len; i++) {
        this.delCookie(keys[i]);
      }
    }
  }
  /**
   * 移除对象空值
   * @param target 需要处理的目标对象
   * @param ruleOut 不处理的键名, 包括所在的所有子级, 可以指定对象数据链，如果是数组: a.b.c[3].d.g[2].key, 数组下所有元素则用 * 号代替数字: a.b.c[\*].d.g[\*].key
   * @param emptyAllClean 当子级为空时，递归清空父级, 默认为 false; 当 ruleOut 为布尔值时, ruleOut 代替 emptyAllClean
   * @returns 
   */
  removeEmpty (target: Array<any>|{[key:string]: any}, ruleOut?:string | Array<string> | boolean, emptyAllClean?:boolean):Array<any>|{[key:string]: any} {
    let outKey:Array<string> = [];
    if (!this.isEmpty(ruleOut) && (this.isString(ruleOut) || this.isArray(ruleOut))) {
      outKey = this.isString(ruleOut) ? [ruleOut] : ruleOut;
    } else if (this.isBoolean(ruleOut)) {
      emptyAllClean = ruleOut;
    }
    const hand = (option:string | Array<any>|{[key:string]: any}, clean:boolean, stackPointerLike?:string) => {
      if (this.isArray(option)) {
        let newObj:Array<any> = [];
        let currentLikeKey = '';
        let otherLikeKey = '';
        for(let i = 0, len = option.length; i < len; i++) {
          currentLikeKey = `${this.isEmpty(stackPointerLike)?'':stackPointerLike}[*]`;
          otherLikeKey = `${this.isEmpty(stackPointerLike)?'':stackPointerLike}[${i}]`;
          for (let oi = 0, olen = outKey.length; oi < olen; oi++) {
            if (outKey[oi].includes(otherLikeKey)) {
              const newStr = outKey[oi].substring(0, otherLikeKey.length);
              newStr === otherLikeKey && (currentLikeKey = newStr);
            }
          }
          if (!outKey.includes(currentLikeKey)) {
            if (!this.isEmpty(option[i])) {
              if (this.isJson(option[i]) || this.isArray(option[i])) {
                const newVal = hand(option[i], false, currentLikeKey);
                if (!emptyAllClean && !clean) {
                  this.isEmpty(newVal) && this.isJson(option[i]) ? newObj.push(option[i]) : newObj.push(newVal);
                } else {
                  !this.isEmpty(newVal) && newObj.push(newVal);
                }
              } else {
                newObj.push(option[i]);
              }
            }
          } else {
            newObj.push(option[i]);
          }
        }
        return newObj;
      }
      if (this.isJson(option)) {
        let newObj = {};
        const objKeys = Object.keys(option);
        let currentLikeKey = '';
        for(let i = 0, len = objKeys.length; i < len; i++) {
          currentLikeKey = `${this.isEmpty(stackPointerLike) ? '' : `${stackPointerLike}.`}${objKeys[i]}`;
          if (!outKey.includes(objKeys[i]) && !outKey.includes(currentLikeKey)) {
            if (!this.isEmpty(option[objKeys[i]]) && option[objKeys[i]] !== 'web-null') {
              if (this.isJson(option[objKeys[i]]) || this.isArray(option[objKeys[i]])) {
                const newVal = hand(option[objKeys[i]], false, currentLikeKey);
                if (!emptyAllClean && !clean) {
                  newObj[objKeys[i]] = newVal;
                } else {
                  !this.isEmpty(newVal) && (newObj[objKeys[i]] = newVal);
                }
              } else {
                newObj[objKeys[i]] = option[objKeys[i]];
              }
            }
          } else {
            newObj[objKeys[i]] = option[objKeys[i]];
          }
        }
        return newObj;
      }
      return option as Array<any>|{[key:string]: any};
    }
    return hand(this.copy(target), true);
  }
  /**
   * 将对象转换为 get 请求方式类型
   * @param obj 需要转换的对象
   * @param isDefault 是否带 ?
   * @returns 
   */
  changeParams (obj:{[key:string]: string}, isDefault?: boolean):string {
    if (this.isJson(obj)) {
      const keys = Object.keys(obj);
      let params = isDefault ? '?' : '';
      for (let i = 0, len = keys.length; i < len; i++) {
        params += params.includes('=')?`&${keys[i]}=${obj[keys[i]] }`:`${keys[i]}=${obj[keys[i]] }`;
      }
      return params;
    }
    return ''
  }
  /**
   * 是有权限，支持 字符串、数组、json (当登录账号为 admin 时，全部返回 true)
   * @param keys 需要获取的 key
   * @returns 
   */
  getPower (keys:string|Array<string>|{[key:string]:string}):boolean | {[key:string]:boolean} {
    const admins = ['admin', 'admin@lapa.com'];
    const userInfo = store.getters['layout/userInfo'];
    const isAdmin:boolean = !this.isEmpty(userInfo.loginName) && admins.includes(userInfo.loginName);
    const permissionsIds = store.getters['layout/permissionsIds'];
    if (this.isEmpty(keys, true)) return isAdmin || false;
    if (this.isJson(keys) || this.isArray(keys)) {
      let newVal:{[key:string]:boolean} = {};
      if (this.isJson(keys)) {
        const objKeys = Object.keys(keys);
        for (let i = 0, len = objKeys.length; i < len; i++) {
          newVal[objKeys[i]] = isAdmin || permissionsIds.includes(keys[objKeys[i]]);
        }
      } else if (this.isArray(keys)) {
        for (let i = 0, len = keys.length; i < len; i++) {
          newVal[keys[i]] = isAdmin || permissionsIds.includes(keys[i]);
        }
      }
      return newVal;
    }
    return this.isString(keys) ? (isAdmin || permissionsIds.includes(keys)) : isAdmin;
  }
  /**
   * 获取html节点设置的样式值
   * @param element 目标节点或节点标识id,class等
   * @param styleName 需要获取的样式名---对应 css 键名
   * @param isNumber 是否返回数字，当值不支持 number 时，则原样返回
   * @returns 
   */
  getElementStyle (element:string | HTMLElement | Element | null, styleName?:string, isNumber?:boolean):number|string|null {
    const newElement = this.isString(element) ? document.querySelector(element) as HTMLElement : element as HTMLElement;
    if (!newElement || this.isEmpty(styleName)) return isNumber ? 0 : null;
    // const style = newElement.currentStyle ? newElement.currentStyle[styleName] : document.defaultView.getComputedStyle(newElement, null)[styleName];
    const style = newElement.currentStyle ? newElement.currentStyle[styleName] : window.getComputedStyle(newElement, null)[styleName];
    if (this.isEmpty(style)) return isNumber ? 0 : null;
    if (!isNumber || !style.includes('px')) return style;
    const styleArr = this.split(style, [' ']);
    let isPass = false;
    let backVal:Array<any> = [];
    for (let i = 0, len = styleArr.length; i < len; i++) {
      if (!styleArr[i].includes('px') || isNaN(parseInt(style))) {
        isPass = true;
      }
      backVal.push(parseInt(styleArr[i]));
    }
    if (isPass) return style;
    return backVal.length === 1 ? backVal[0] : backVal;
  }
  /**
   * 获取元素坐标(元素的左上角为基点)
   * @param element 目标节点或节点标识id,class等标识
   * @returns 
   */
  getElementOffset (element:string | HTMLElement | Element | null):{x:number, y:number} {
    const newElement = this.isString(element) ? document.querySelector(element) as HTMLElement : element as HTMLElement;
    let offset = { x: 0, y: 0 }
    if (this.isEmpty(newElement)) return offset;
    let current = newElement.offsetParent as HTMLElement;
    offset.x += newElement.offsetLeft;
    offset.y += newElement.offsetTop;
    while (current !== null) {
      offset.x += current.offsetLeft || 0;
      offset.y += current.offsetTop || 0;
      current = current.offsetParent as HTMLElement;
    }
    return offset;
  }
  /**
   * 获取元素所在被滚动距离
   * @param element 目标节点或节点标识id,class等标识
   * @returns 
   */
  getElementScrollTop (element:string | HTMLElement | Element | null):number {
    const newElement = this.isString(element) ? document.querySelector(element) as HTMLElement : element as HTMLElement;
    if (!newElement) return 0;
    let top = 0;
    let current = newElement.parentNode as HTMLElement;
    while (current !== null) {
      top += current.scrollTop || 0;
      current = current.parentNode as HTMLElement;
    }
    return top;
  }
  /**
   * 将指定日期转为指定时差的时间
   * @param date 需要转换的时间
   * @param format 返回格式, 例: YYYY/MM/DD HH:mm:ss:SSS 默认Date 对象; https://day.js.org/docs/en/display/format
   * @param timeDifference 时差(需要转换的时间与国际时间的时差, 默认为本地时间与国际时间的时差)
   */
  toLocaleDate (date?:string | Date | number, format?:string, timeDifference?:number|string) {
    const timeDif = Number(timeDifference);
    let nformat = format;
    if (!this.isEmpty(nformat) && ['fulltime'].includes(nformat.toLocaleLowerCase())) {
      nformat = 'YYYY-MM-DD HH:mm:ss';
    }
    if (this.isEmpty(date)) {
      return !this.isEmpty(nformat) ? dayjs().format(nformat) : new Date(dayjs().format('YYYY/MM/DD HH:mm:ss:SSS'));
    }
    const dateObj = this.isDate(date) ? date : new Date(this.isString(date) ? date.replace(/-/g, '/') : date);
    const newDate = dayjs(dateObj).add((this.isEmpty(timeDif) ? tool.getTimeDifference() : timeDif), 'hour');
    return !this.isEmpty(nformat) ? newDate.format(nformat) : new Date(newDate.format('YYYY/MM/DD HH:mm:ss:SSS'));
  }
  /**
   * 将指定日期通过时差转为国际标准时间
   * @param date 需要转换的时间
   * @param format 返回格式, 例: YYYY/MM/DD HH:mm:ss:SSS 默认Date 对象; https://day.js.org/docs/en/display/format
   * @param timeDifference 时差(需要转换的时间与国际时间的时差, 默认为本地时间与国际时间的时差)
   */
  toISODate (date?:string | Date | number, format?:string, timeDifference?:number|string) {
    const dateObj = !this.isEmpty(date) ? this.isDate(date) ? date : new Date(this.isString(date) ? date.replace(/-/g, '/') : date) : new Date();
    const timeDif = Number(timeDifference);
    let nformat = format;
    if (!this.isEmpty(nformat) && ['fulltime'].includes(nformat.toLocaleLowerCase())) {
      nformat = 'YYYY-MM-DD HH:mm:ss';
    }
    const newDate = dayjs(dateObj).add(-(this.isEmpty(timeDif) ? tool.getTimeDifference() : timeDif), 'hour');
    return !this.isEmpty(nformat) ? newDate.format(nformat) : new Date(newDate.format('YYYY/MM/DD HH:mm:ss:SSS'));
  }
  /**
   * Promise.allSettled 并发请求限制
   * @param concurrency 数据源
   * @param {object} options 其他配置
   * @param options.limit 并发最大数量, 默认 10
   * @param options.progress 执行进度，每次完成一个请求时回调一次，返回当前进度的百分比
   * @returns 
  */
  allSettled (concurrency:Array<Function> = [], {limit = 10, progress = (percent:number) => {} } = {}):Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>> {
    return new Promise((resolve) => {
      tool.enqueuePromise(concurrency, {limit: limit, progress: progress }).then(ret => {
        if (this.isFunction(Promise.allSettled)) {
          resolve(Promise.allSettled(ret));
        } else {
          Promise.all(ret).then(res => {
            let obj:Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}> = [];
            for (let i = 0, len = res.length; i < len; i++) {
              obj.push({status: 'fulfilled', value: res[i]});
            }
            resolve(obj);
          }).catch((error) => {
            let obj:Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}> = [];
            for (let i = 0, len = ret.length; i < len; i++) {
              obj.push({status: 'rejected', reason: error});
            }
            resolve(obj);
          });
        }
      })
    })
  }
  /**
   * Promise.all 并发请求限制
   * @param concurrency 数据源
   * @param {object} options 其他配置
   * @param options.limit 并发最大数量, 默认 10
   * @param options.progress 执行进度，每次完成一个请求时回调一次，返回当前进度的百分比
   * @returns
  */
  promiseAll (concurrency:Array<Function> = [], {limit = 10, progress = (percent:number) => {} } = {}):Promise<Array<any>> {
    return new Promise((resolve) => {
      tool.enqueuePromise(concurrency, {limit: limit, progress: progress }).then(ret => {
        resolve(Promise.all(ret))
      })
    })
  }
}

export default new commonClass();