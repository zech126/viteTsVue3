import Cookies from 'js-cookie';
import store from '@/store'
import { cloneDeep } from 'lodash';

const common = {
  // 深拷贝
  copy: (obj:any) => {
    return cloneDeep(obj);
  },
  // 是否数组
  isArray: (arr:any) => {
    if (typeof arr === 'undefined') return false;
    if (Array.isArray) return Array.isArray(arr);
    return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
  },
  // 是否对象, 包含数组和json
  isObject: (obj:any) => {
    if (common.isArray(obj)) return true;
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
  },
  // 是json
  isJson: (obj:any) => {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
  },
  // 是否数字类型
  isNumber: (num:any) => {
    return Object.prototype.toString.call(num).slice(8, -1) === 'Number';
  },
  // 是否字符串
  isString: (str:any) => {
    return Object.prototype.toString.call(str).slice(8, -1) === 'String';
  },
  // 是否为空， 包括 空数组，空对象， null、空字符串、undefined、NaN
  isEmpty: (val:any, type:any = false) => {
    if (['', null, 'undefined', undefined].includes(type && common.isString(val) ? val.trim() : val)) return true;
    if (common.isJson(val)) return Object.keys(val).length === 0;
    if (common.isArray(val)) return val.length === 0;
    if (common.isNumber(val) && isNaN(val)) return true;
    return false;
  },
  // 是否boolean
  isBoolean: (val:any) => {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Boolean';
  },
  // 是否函数
  isFunction: (fun:any) => {
    return Object.prototype.toString.call(fun).slice(8, -1) === 'Function'
  },
  // 是否时间
  isDate: (val:any) => {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Date'
  },
  // 是否正则
  isRegExp: (val:any) => {
    return Object.prototype.toString.call(val).slice(8, -1) === 'RegExp'
  },
  isSymbol: (val:any) => { // 是否Symbol函数
    return Object.prototype.toString.call(val).slice(8, -1) === 'Symbol'
  },
  // 是否Promise对象
  isPromise: (val:any) => {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Promise'
  },
  // 是否Set对象
  isSet: (val:any) => {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Set'
  },
  // 数组去重
  arrRemoveRepeat: (arr:any) => {
    return Array.from(new Set(arr));
  },
  // 移除对象中所有为字符串的值 2 端空格
  // exceptionKey 不处理的键名
  trim: (obj:any, exceptionKey:any, type = false) => {
    const exception = common.isString(exceptionKey) ? [exceptionKey] : exceptionKey || [];
    if (common.isEmpty(obj, true)) return '';
    let newObj = type ? obj : common.copy(obj);
    if (common.isString(newObj)) return obj.trim();
    if (common.isObject(newObj)) {
      if (common.isArray(newObj)) {
        newObj.forEach((item:any, index:any) => {
          if (common.isObject(item)) {
            common.trim(item, exception, true);
          } else if (common.isString(item)) {
            newObj[index] = item.trim();
          }
        })
      } else if (common.isJson(newObj)) {
        Object.keys(newObj).forEach(key => {
          if (common.isObject(newObj[key])) {
            common.trim(newObj[key], exception, true);
          } else if (common.isString(newObj[key]) && !exception.includes(key)) {
            newObj[key] = newObj[key].trim();
          }
        })
      }
    }
    return newObj;
  },
  /* 获取全部url参数,并转换成json对象 */
  getUrlParams (config:any = {}) {
    const newUrl = decodeURIComponent(config.url || window.location.href);
    if (newUrl.indexOf('?') === -1) return {};
    const urlOption = newUrl.substring(newUrl.indexOf('?') + 1);
    const urlList = urlOption.split('&');
    let urlJson:any = {};
    urlList.forEach(item => {
      const pos = item.indexOf('=');
      urlJson[item.substring(0, pos)] = item.substring(pos + 1);
    })
    if (config.keys && typeof config.keys === 'string') {
      return urlJson[config.keys];
    } else if (config.keys && common.isArray(config.keys)) {
      return config.keys.map((key:any) => {
        return { [key]: urlJson[key] };
      })
    }
    return urlJson;
  },
  // 复制到粘贴板上
  copyToClip (content:any) {
    let copyTxt = content;
    if (common.isObject(copyTxt)) {
      copyTxt = JSON.stringify(copyTxt);
    }
    return new Promise(resolve => {
      // execCommand 方法有可能弃用，，
      if (document.execCommand) {
        let staging = document.createElement('input');
        // const dome = document.querySelector('body')
        staging.setAttribute('value', copyTxt);
        document.body.appendChild(staging);
        staging.style.position = 'absolute';
        staging.style.top = '-500px';
        staging.select();
        document.execCommand('copy');
        document.body.removeChild(staging);
        resolve(true);
      } else {
        console.error('浏览器不支持该操作');
        resolve(false);
      }
    })
  },
  // base64 转为文件格式
  base64ToFile (base64Data:any, fileName = '') {
    const arr = base64Data.split(',');
    const fileType = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let leng = bstr.length;
    let UintArr = new Uint8Array(leng);
    while (leng--) {
      UintArr[leng] = bstr.charCodeAt(leng);
    }
    const newFile = new File([UintArr], fileName, {
      type: fileType
    })
    return newFile;
  },
  // 获取cookie, 支持数组和json
  getCookie (keys:any) {
    if (common.isObject(keys)) {
      let newVal:any = {};
      if (common.isJson(keys)) {
        Object.keys(keys).forEach((key:any) => {
          newVal[key] = Cookies.get(keys[key]) || '';
        })
      }
      if (common.isArray(keys)) {
        keys.forEach((key:any) => {
          newVal[key] = Cookies.get(key) || '';
        })
      }
      return newVal;
    }
    return common.isString(keys) ? (Cookies.get(keys) || '') : '';
  },
  // 插入cookie，支持数组和json
  setCookie (key:any = null, val:any = null, expires = {}) {
    if (common.isEmpty(key)) return;
    if (common.isJson(key)) {
      Object.keys(key).forEach(item => {
        if(!common.isEmpty(key[item].key) && !common.isEmpty(key[item].value)) {
          Cookies.set(key[item].key, key[item].value, key[item].expires || {});
        }
      })
    } else if (common.isArray(key)) {
      key.forEach((item:any) => {
        if(!common.isEmpty(item.key) && !common.isEmpty(item.value)) {
          Cookies.set(item.key, item.value, item.expires || {});
        }
      })
    } else if(typeof key === 'string' && !common.isEmpty(key) && !common.isEmpty(val)){
      Cookies.set(key, val, expires);
    }
  },
  // 移除,支持数组
  delCookie (keys:any) {
    if (typeof keys === 'string' && !common.isEmpty(keys)) {
      Cookies.remove(keys);
    } if (common.isArray(keys)) {
      keys.forEach((item:any) => {
        common.delCookie(item);
      })
    }
  },
  // 移除空值(不对原有数据修改)
  // ruleOut 数据类型为数组，为空值时不移除的键名集合
  removeEmpty (obj:any = {}, ruleOut = [] as any[], old:any = {}, oldKey:any = '', type = false) {
    let newObj = !type ? common.copy(obj) : obj;
    if (!common.isEmpty(newObj)) {
      if (common.isArray(newObj)) {
        old[oldKey] = newObj.filter((item:any) => {
          return !common.isEmpty(item) && item !== 'web-null';
        })
        if (common.isEmpty(old[oldKey]) && !ruleOut.includes(oldKey)) {
          delete old[oldKey]
        } else {
          old[oldKey].forEach((item:any, index:any) => {
            common.isObject(item) && common.removeEmpty(item, ruleOut, old[oldKey], index, true);
          })
        }
      } else if (common.isJson(newObj)) {
        Object.keys(newObj).forEach((key:any) => {
          if ((common.isEmpty(newObj[key]) || newObj[key] === 'web-null') && !ruleOut.includes(key)) {
            delete newObj[key];
          } else if (common.isObject(newObj[key])) {
            common.removeEmpty(newObj[key], ruleOut, obj, key, true);
          }
        })
      }
    }
    return newObj;
  },
  // 将对象转换为 get 请求方式类型
  changeParams: (obj:any) => {
    if (common.isJson(obj)) {
      const keys = Object.keys(obj);
      let params = '';
      keys.forEach(key => {
        params += params.includes('=')?`&${key}=${obj[key] }`:`${key}=${obj[key] }`;
      })
      return params;
    }
    return ''
  },
  // 是有权限，支持 字符串、数组、json (当登录账号为 admin 时，全部返回 true)
  getPower: (str:any) => {
    const userInfo = store.getters['layout/userInfo'];
    const isPass = userInfo.loginName && ['admin', 'admin@lapa.com'].includes(userInfo.loginName);
    const permissionsIds = store.getters['layout/permissionsIds'];
    if (common.isObject(str)) {
      let newVal:any = {};
      if (common.isJson(str)) {
        Object.keys(str).forEach(key => {
          newVal[key] = isPass || permissionsIds.includes(str[key]);
        })
      }
      if (common.isArray(str)) {
        str.forEach((key:any) => {
          newVal[key] = isPass || permissionsIds.includes(key);
        })
      }
      return newVal;
    }
    return common.isString(str) ? (isPass || permissionsIds.includes(str)) : isPass;
  },
  // 获取html节点设置的样式值
  // element 目标节点或节点标识id,class等
  // styleName 需要获取的样式名---对应 css 键名
  // isNumber 是否返回数字，当值不支持 number 时，则原样返回
  getElementStyle (element:any, styleName:any, isNumber = false) {
    const newElement = typeof element === 'string' ? document.querySelector(element) : element;
    if (!newElement || common.isEmpty(styleName)) return isNumber ? 0 : null;
    // @ts-ignore
    const style:any = newElement.currentStyle ? newElement.currentStyle[styleName] : document.defaultView.getComputedStyle(newElement, null)[styleName];
    if (common.isEmpty(style)) return isNumber ? 0 : null;
    if (!isNumber || !style.includes('px')) return style;
    const styleArr = style.split(' ');
    let isPass = false;
    let backVal:any = [];
    styleArr.forEach((item:any) => {
      if (!item.includes('px') || isNaN(parseInt(style))) {
        isPass = true;
      }
      backVal.push(parseInt(item));
    })
    if (isPass) return style;
    return backVal.length === 1 ? backVal[0] : backVal;
  }
}
// export default common;
export default common;
