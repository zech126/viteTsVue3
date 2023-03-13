import common from '@/utils/common';
import bus from '@/utils/bus';
import store from '@/store';
import cookieConfig from '@/utils/cookieConfig';
import navListConfig from '@/layout/navListConfig'
import { ElMessageBox, ElMessage  } from 'element-plus';

const process:ImportMetaEnv = import.meta.env;
const AUTHUrl = window.location.origin.includes('172.20.200.14') ? process.VITE_AUTH.replace('dyt.pms.com.cn', '172.20.200.14') : process.VITE_AUTH;

const authHand = {
  againLoginPage: '/index.html#/againLoginAuth', // 重新登录页
  homePage: '/index.html#/home', // 首页
  loginPage: '/index.html#/login',  // 登录页
  recordUrl: `${window.location.protocol}//${AUTHUrl}`, // 对应认证中心地址
  targetEnv: process.VITE_CONFIG, // 环境变
  systemCode: process.VITE_SYSTEMCODE, // 系统代码

  addModal: (config:{[k:string]:any}) => {
    const body:any = document.querySelector('body');
    let className = body.className.split(' ');
    if (!body.className.includes('again-login-body')) {
      className.push('again-login-body');
      body.className =  className.join(' ');
    }
    ElMessageBox.alert(config.content, config.title, {
      customClass: `${config.calssName ? `${config.calssName} again-login-message` : 'again-login-message'}`,
      dangerouslyUseHTMLString: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      buttonSize: 'default',
      showConfirmButton: false
    })
  },
  removeModal: () => {
    setTimeout(() => {
      const body:any = document.querySelector('body');
      let className:any = body.className.split(' ');
      if (className.includes('again-login-body')) {
        className.splice(className.indexOf('again-login-body'), 1);
        body.className =  className.join(' ');
      }
      const btn:any = document.querySelector('.el-message-box.again-login-message .el-message-box__btns .el-button');
      btn && btn.click();
    }, 100)
  },
  /**
 * 保存当前用户退出登录时的地址
 * @param target: 退出时候的地址
 * @returns 返回布尔值
 */
  saveTarget (target?: string) {
    return new Promise((resolve) => {
      const newTarget = common.isEmpty(target) ? window.location.href : target;
      bus.authSysData('saveTarget', {systemCode: this.systemCode, target: newTarget}).then(res => {
        resolve(res);
      })
    })
  },
  /**
   * 登录认证中心(自定义登录页面设计时或再次登录时用)
   * @param userName 账号
   * @param password 密码(需要加密后的密码)
   * @returns 返回登录成功后的 token 对象
   */
  loginAuth (userName: string, password: string) {
    return new Promise((resolve) => {
      this.encryption(password).then(newPass => {
        bus.authSysData('loginAuth', {pageName: userName, pagePame: newPass}).then(res => {
          resolve(res);
        })
      })
    })
  },
  /**
   * 从认证中心获取登录人账号密码(密码是为已加密)
   * @returns 返回一个对象
   */
   getOperation () {
    return new Promise((resolve) => {
      bus.authSysData('getOperation').then(res => {
        resolve(res);
      })
    })
  },
  /**
   * 退出认证中心
   * @param tipsText 退出登录弹窗提示
   * @param isBackLogin 是否返回登录页(默认返回)
   * @returns 返回布尔值
   */
  outLogin (tipsText?:string, isBackLogin = true):Promise<boolean> {
    return new Promise((resolve) => {
      ElMessageBox.confirm(tipsText || '退出认证中心，已打开的系统将受到影响，是否确认退出？', "提示", {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default'
      }).then(() => {
        const content = `<div style="padding: 10px 30px 10px 15px; line-height: 1.2em;">
          <i class="lapa icon-loading" style="margin-right:10px; font-size: 24px; color: #2d8cf0;vertical-align: middle;"></i>
          <span style="vertical-align: middle;">正在退出系统...</span>
        </div>`;
        this.addModal({ content: content, title: '' });
        bus.authSysData('outLogin').then(res => {
          this.removeModal();
          if (!res) {
            ElMessage({ message: '退出系统失败，请重新操作!', type: 'error' });
          } else {
            common.delCookie([cookieConfig.tokenName]);
            ElMessage({ message: '成功退出系统', type: 'success' });
            // 返回登录页面
            setTimeout(() => {
              isBackLogin && this.goToLogin();
            }, 500)
          }
          resolve(res);
        })
      }).catch(() => {})
    })
  },
  /**
   * 获取登录的 token 对象
   * @param isUpdate 是否更新状态
   * @returns 返回一个对象
   */
  getToken (isUpdate?:boolean):Promise<{[k:string]:any} | null> {
    const pageUrl = window.location.href;
    return new Promise((resolve) => {
      bus.authSysData('getToken').then((token) => {
        let urlParams = common.getUrlParams({url: pageUrl})  as {[key:string]:any};
        const newUrl =  `${pageUrl.substring(0, pageUrl.indexOf('?'))}`;
        if (!common.isEmpty(token)) {
          const accessCookie = common.getCookie(cookieConfig.tokenName);
          const newCookie = `${token.token_type} ${token.access_token}`;
          if (accessCookie !== newCookie || isUpdate) {
            common.setCookie([
              {key: cookieConfig.tokenName, value: newCookie}
            ]);
          }
          if (!common.isEmpty(urlParams.pageName) && !common.isEmpty(urlParams.pagePass)) {
            delete urlParams.pageName;
            delete urlParams.pagePass;
            window.location.replace(common.isEmpty(urlParams) ? newUrl : `${newUrl}?${common.getParams(urlParams)}`);
            setTimeout(() => {resolve(token)}, 500);
          }
          return resolve(token);
        }
        // 在苹果手机端 iframe 跨域的情况下读取不到缓存信息：包括session、cookie等; 所以需要在 iframe 里调用一次登录
        if (!common.isEmpty(urlParams.pageName) && !common.isEmpty(urlParams.pagePass)) {
          bus.authSysData('loginAuth', {pageName: urlParams.pageName, pagePame: urlParams.pagePass, getUserInfo: true}).then(res => {
            delete urlParams.pageName;
            delete urlParams.pagePass;
            window.location.replace(common.isEmpty(urlParams) ? newUrl : `${newUrl}?${common.getParams(urlParams)}`);
            setTimeout(() => {resolve(res)}, 500);
          })
          return;
        }
        resolve(null);
      })
    })
  },
  /**
   * 获取登录人的信息
   * @param isUpdate 是否更新状态
   * @returns 返回一个对象
   */
  getUserInfo (isUpdate?:boolean) {
    return new Promise((resolve) => {
      bus.authSysData('getUserInfo').then(res => {
        const userInfo = store.getters['layout/userInfo'];
        if (!common.isEmpty(res) && (common.isEmpty(userInfo) || userInfo.loginName !== res.username || isUpdate)) {
          store.commit('layout/userInfo', {...(res || {}), loginName: res.username});
        }
        setTimeout(() => {
          resolve(res);
        }, 200)
      })
    })
  },
  /**
   * 验证当前 token 是否有效
   * @returns 返回布尔值
   */
  validationToken ():Promise<boolean> {
    return new Promise((resolve) => {
      bus.authSysData('validationToken').then(res => {
        resolve(res);
      })
    })
  },
  /**
   * 获取登录人当前系统的全部权限
   * @param isUpdate 是否更新状态
   * @returns 返回权限数组
   */
  getPermissions (isUpdate?:boolean) {
    return new Promise((resolve) => {
      bus.authSysData('getPermissions', {systemCode: this.systemCode}).then(res => {
        // 存储权限
        if (isUpdate || common.isEmpty(store.getters['layout/permissionsIds'])) {
          store.commit('layout/permissionsIds', res);
        }
        resolve(res);
      })
    })
  },
  /**
   * 获取登录人当前系统的菜单
   * @param isUpdate 是否更新状态
   * @returns 返回菜单数组
   */
  getSysMenu (isUpdate?:boolean) {
    return new Promise((resolve) => {
      bus.authSysData('getSysMenu', {systemCode: this.systemCode}).then(res => {
        const addTree:Array<any> = common.isBoolean(process.SSR) && process.DEV ? navListConfig : [];
        // 存储菜单
        if (isUpdate || common.isEmpty(store.getters['layout/menuTree'])) {
          store.commit('layout/menuTree', [...(res || []), ...addTree]);
        }
        resolve(res);
      })
    })
  },
  /**
   * 获取部门树
   * @param isUpdate 是否更新状态
   * @returns 返回部门树结构
   */
  getDepartment (isUpdate?:boolean) {
    return new Promise((resolve) => {
      bus.authSysData('getDepartment').then(res => {
        resolve(res);
      })
    })
  },
  /**
   * 获取通途 ticket
   * @returns 返回 ticket
   */
  getTicket () {
    return new Promise((resolve) => {
      bus.authSysData('getTicket').then(res => {
        resolve(res);
      })
    })
  },
  // 自定义获取信息
  customGetInfo (awaitData: Promise<any> | Array<Promise<any> |
    {dataOrigin: Promise<any>, key: string}> |
    {dataOrigin: Promise<any>, key: string}
  ):Promise<any> {
    return new Promise((resolve) => {
      const awaitObj = common.isArray(awaitData) ? awaitData : [awaitData];
      let awaitList:Array<any> = [];
      let keysObj:Array<{type: boolean, key: string}> = [];
      awaitObj.forEach((item, index) => {
        if (common.isPromise(item)) {
          awaitList.push(() => {
            return item
          });
          keysObj.push({type: false, key: `undefined-key-${index}`});
        } else {
          awaitList.push(() => {
            return item.dataOrigin
          });
          keysObj.push({type: true, key: item.key});
        }
      });
      let resObj:{[k:string]:any} = {};
      const isAdd = keysObj.map(m => !!m.type);
      common.allSettled(awaitList).then(arr => {
        if (isAdd.length === 0) {
          return resolve(arr.map(m => {
            return m.status === 'fulfilled' ? m.value : null
          }));
        }
        arr.forEach((res, index) => {
          resObj[keysObj[index].key] = res.status === 'fulfilled' ? res.value : null;
        });
        resolve(resObj);
      })
    })
  },
  // 加密
  encryption (text:string):Promise<string> {
    return new Promise((resolve) => {
      bus.authSysData('encryption', text).then(res => {
        resolve(res);
      })
    })
  },
  // 重新登录
  againLogin (type:any = false) {
    const againLoginFun = (e:MessageEvent) => {
      const key = e.data['key'];
      if (common.isEmpty(key) || !['auth-againLogin'].includes(key)) return;
      const res = e.data['value'];
      if (common.isEmpty(res)) return;
      this.removeModal();
      window.removeEventListener('message', againLoginFun);
    }
    // 移除 cookie
    common.delCookie([cookieConfig.tokenName]);
    // 绑定方法
    window.addEventListener('message', againLoginFun);
    const content = `<iframe
      style="max-width: 800px; width: 95vw; height: 60vh; border: none;"
      id="againLogin" src="${this.recordUrl}${this.againLoginPage}?iframe=iframe&targetEnv=${this.targetEnv}"
      class="again-login-iframe"
    />`;
    this.addModal({ content: content, title: '', calssName: 'again-login-content' });
    // 设置弹窗层级最高
    setTimeout(() => {
      const dome = Array.prototype.slice.call(document.querySelectorAll('.again-login-content'), 0);
      dome.forEach(item => {
        item.parentNode.style.zIndex = '2147483646';
      })
    }, 320)
  },
  // 返回到指定路径, 不带参数返回认证中心首页
  backOauth (url:any = null, type:any = false) {
    const oauthHome = typeof url === 'string' ? url : `${this.recordUrl}${this.homePage}?targetEnv=${this.targetEnv}`;
    window.location.href = oauthHome;
  },
  /**
   * 返回到登录页面
   * @param type 重新登录后是否进入认证中心首页(默认为跳转到退出登录页面)
   */
  goToLogin (type:boolean = false, outLogin: boolean = true) {
    const login = `${this.recordUrl}${this.loginPage}?targetEnv=${this.targetEnv}&systemKey=${this.systemCode}${outLogin?'&outLogin=outLogin':''}`;
    // 移除 cookie
    common.delCookie([cookieConfig.tokenName]);
    if (!type) {
      this.backOauth(`${login}&target=${window.location.href}`, true);
    } else {
      this.backOauth(`${login}`, true);
    }
  },
  /**
   * 手动去刷新 token
   * @param isDebounce 是否防抖，防止多次刷新
   * @returns 返回一个对象
   */
   refreshToken (isDebounce?:boolean):Promise<{[k:string]:any} | null> {
    return new Promise((resolve) => {
      bus.authSysData('refreshToken', isDebounce).then((token) => {
        if (!common.isEmpty(token)) {
          common.setCookie([
            {key: cookieConfig.tokenName, value: `${token.token_type} ${token.access_token}`}
          ]);
        }
        resolve(token);
      })
    })
  },
  // 停止认证中心自动刷新token
  clearRefreshToekn () {
    bus.authSysData('clearRefreshToekn');
  },
  // 启用认证中心自动刷新 token
  enableAutoRefresh () {
    bus.authSysData('enableAutoRefresh');
  }
}

export default authHand;