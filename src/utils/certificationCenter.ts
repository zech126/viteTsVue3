import common from '@/utils/common';
import cookieConfig from '@/utils/cookieConfig';
import NProgress from 'nprogress';
import { ElMessageBox, ElMessage  } from 'element-plus';
import store from '@/store';
import navListConfig from '@/layout/navListConfig'

const process:ImportMetaEnv = import.meta.env;

const AUTHUrl = window.location.origin.includes('172.20.200.14') ? process.VITE_AUTH.replace('dyt.pms.com.cn', '172.20.200.14') : process.VITE_AUTH;
const tool:any = {
  targetPage: '/index.html#/messageHand', // 获取数据页
  // targetPage: '/index.html#/recordPages', // 获取数据页
  againLoginPage: '/index.html#/againLogin', // 重新登录页
  homePage: '/index.html#/home', // 首页
  loginPage: '/index.html#/login',  // 登录页
  // 检查认证中心服务是否可访问
  networkTest: `${window.location.protocol}//${AUTHUrl}/static/js/networkTest.js`,
  isPass: false,
  clearPassTime: null,
  targetEnv: process.VITE_CONFIG, // 环境变
  recordUrl: `${window.location.protocol}//${AUTHUrl}`, // 对应认证中心地址
  systemCode: process.VITE_SYSTEMCODE, // 系统代码
  messageKey: 'recordInfo',  // 通讯 key
  connection: 'connectionAuth', // 连接认证中心 KEY
  isConnection: false,
  openFail: () => {
    ElMessageBox.confirm('获取认证中心信息失败，无法打开当前系统，是否前往认证中心？', "提示", {
      closeOnClickModal: false,
      closeOnPressEscape: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      buttonSize: 'default'
    }).then(() => {
      certification.goToLogin();
    }).catch(() => {})
  },
  postMessageHand(config:any = {}) {
    if ((!config.type || !config.src) && !config.remove) {
      console.error(`参数格式错误, 请参考:
      postMessageHand({
        type: '传递数据获取对应数据类型,接收方类型必须相同, 类型: string, 必传',
        src: '目标链接, 类型: string, 必传',
        data: '需要传递的参数',
        responseHand: '目标页面接收到数据并且响应返回的数据, 类型: function'
      }) `)
      return;
    }
    const key = `${tool.messageKey}${config.type}`;
    const hand = {
      isloadSuccess: () => {
        // 用于检测目标链接是否能正常打开
        return new Promise((resolve, reject) => {
          if (tool.isPass) return resolve({success: true});
          let link = document.createElement('script');
          link.src = tool.networkTest;
          document.body.appendChild(link);
          // 加载成功
          link.onload = () => {
            tool.isPass = true;
            resolve(true);
            link.remove();
          }
          // 加载失败
          link.onerror = (e) => {
            tool.isPass = false;
            reject(false);
            link.remove();
          }
        })
      },
      createIframe: () => {
        if (tool.clearPassTime) {
          clearTimeout(tool.clearPassTime);
          tool.clearPassTime = null;
        }
        hand.isloadSuccess().then(res => {
          let oldIframe:any = document.querySelector(`#iframe${tool.messageKey}`);
          // 绑定方法
          window.addEventListener('message', hand[`resources${key}`]);
          if (!oldIframe) {
            // 监听是否连接上认证中心
            window.addEventListener('message', hand[`auth${tool.messageKey}`]);
            // 创建 iframe 指向 认证中心
            tool[`iframe${key}`] = document.createElement('iframe');
            tool[`iframe${key}`].id = `iframe${tool.messageKey}`;
            tool[`iframe${key}`].src = `${config.src}?iframe=iframe&targetEnv=${tool.targetEnv}`;
            tool[`iframe${key}`].style.display = 'none';
            document.body.appendChild(tool[`iframe${key}`]);
          } else {
            oldIframe.contentWindow.postMessage({ [`${key}`]: { ...config.data, type: config.type } }, '*');
          }
        }).catch(() => {
          store.commit('routerModel/routerLoading', false);
          NProgress.done();
          tool.openFail();
        })
      },
      // 接收认证中心加载完成信息
      [`auth${tool.messageKey}`]: (e:any) => {
        if (typeof e.data[`${tool.messageKey}${tool.connection}`] === 'undefined') return;
        // 解除绑定
        window.removeEventListener('message', hand[`auth${tool.messageKey}`]);
        if (typeof e.data[`${tool.messageKey}${tool.connection}`] === 'boolean' && e.data[`${tool.messageKey}${tool.connection}`]) {
          tool[`iframe${key}`].contentWindow.postMessage({ [`${key}`]: { ...config.data, type: config.type } }, '*');
        } else {
          tool.openFail();
        }
      },
      // 认证中心返回值
      [`resources${key}`]: (e:any) => {
        if (typeof e.data[`${key}`] === 'undefined') return;
        // 解除绑定
        typeof config.responseHand === 'function' && config.responseHand(e.data[`${key}`]);
      },
      removeEvent: () => {
        // 解除绑定
        window.removeEventListener('message', hand[`resources${key}`]);
      }
    }
    // 执行处理
    config.remove ? hand.removeEvent() : hand.createIframe();
  },
  addModal: (config:any) => {
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
  }
}
const certification = {
  // 向认证中心获取信息, key系统名称, prams 需要传递的数据， type获取数据类型, callBack回调
  recordCertification (config:any = {}) {
    return new Promise((resolve, reject) => {
      let urlParams = common.getUrlParams({ url: window.location.search || window.location.href });
      if (urlParams['pageName'] && urlParams['pagePame']) {
        tool.postMessageHand({
          type: 'loginAuth',
          src: `${tool.recordUrl}${tool.targetPage}`,
          data: {
            prams: {
              pageName: urlParams['pageName'],
              pagePame: urlParams['pagePame']
            }
          },
          responseHand: (res:any) => {
            // 当登录失败时，还是跳转到登录页面
            if (!res) {
              certification.goToLogin();
              return;
            }
            delete urlParams['pageName'];
            delete urlParams['pagePame'];
            let href = window.location.href.substring(0, window.location.href.indexOf('?'));
            if (!common.isEmpty(urlParams)) {
              let newParams = '';
              Object.keys(urlParams).forEach(key => {
                newParams = newParams ? `${newParams}&${key}=${urlParams[key]}` : `${key}=${urlParams[key]}`
              })
              href = `${href}?${newParams}`;
            }
            window.location.href = href;
            if (common.isEmpty(window.location.search)) {
              window.location.reload();
            }
          }
        })
      } else {
        const locat = window.location;
        if (!common.isEmpty(locat.search)) {
          if (locat.href.includes(`${locat.search}#/`)) {
            locat.href = `${locat.origin}${locat.pathname}${locat.hash}${locat.hash.includes('?')?locat.search.replace('?', '&'):locat.search}`;
          }
        }
        tool.postMessageHand({
          type: config.type || 'getToken',
          src: `${tool.recordUrl}${tool.targetPage}`,
          data: {
            cookie: document.cookie,
            // 系统标识
            prams: config.prams || {}
          },
          responseHand: (res:any) => {
            resolve(res);
          }
        })
      }
    })
  },
  // 刷新信息
  refreshToken (config:any = {}) {
    // 获取信息
    return new Promise((resolve, reject) => {
      certification.recordCertification({
        type: 'getToken'
      }).then((info:any) => {
        // 当认证中心不存在token时，跳转登录
        if (!info.login || !info.token) {
          certification.goToLogin();
          return resolve(false);
        }
        // 当账号相同, token 不同时, 说明已刷新过 token 
        const DYTToken = common.getCookie(cookieConfig.tokenName);
        if (!DYTToken || DYTToken !== `${info.token.token_type} ${info.token.access_token}`) {
          certification.authTokenHand(info.token, info.login.loginName);
          // 执行下次刷新
          certification.refreshToken();
          return resolve(true);
        }
        // 刷新 token
        tool.postMessageHand({
          type: 'refreshToken',
          src: `${tool.recordUrl}${tool.targetPage}`,
          data: {
            prams: config.prams || {}
          },
          responseHand: (res:any) => {
            // 存在token 刷新失败时弹窗重新登录窗口，否则跳转到认证中心登录页面
            if (!res.success) {
              certification[`${res.tagert === 'login' ? 'goToLogin' : 'againLogin'}`](true);
              resolve(false);
            } else {
              // 此次处理token
              certification.authTokenHand(res, info.login.loginName);
              // 刷新成功后，执行下次刷新
              certification.refreshToken();
              resolve(true);
            }
          }
        })
      }).catch((e)=>{
        reject(e)
      })
    })
  },
  // 验证 token 是否已过期
  validationHand (config:any = {}) {
    return new Promise((resolve, reject) => {
      tool.postMessageHand({
        type: 'validationToken',
        src: `${tool.recordUrl}${tool.targetPage}`,
        data: {
          prams: config.prams || {}
        },
        responseHand: (res:any) => {
          resolve(res)
        }
      })
    })
  },
  // 重新登录
  againLogin (type:any = false) {
    const againLoginFun = (e:any) => {
      let res = e.data.againLogin;
      if (!res) return;
      if (res.success) {
        tool.removeModal();
        // 解除绑定
        window.removeEventListener('message', againLoginFun);
        // 进行 token 处理
        certification.authTokenHand(res.data.token, res.data.login.loginName, true);
        // 重新登录后账号是否相同，不同则跳转当前系统首页
        if (!res.sameAccount) {
          window.location.replace(window.location.href.split('#/')[0]);
          return
        }
        // 重新登录成功后，启动刷新 token 方法
        type ? window.location.reload() : certification.refreshToken();
      }
    }
    // 移除 cookie
    common.delCookie([cookieConfig.tokenName]);
    // 绑定方法
    window.addEventListener('message', againLoginFun);
    const content = `<iframe
      style="max-width: 800px; width: 95vw; height: 60vh; border: none;"
      id="againLogin" src="${tool.recordUrl}${tool.againLoginPage}?iframe=iframe&targetEnv=${tool.targetEnv}"
      class="again-login-iframe"
    />`;
    tool.addModal({ content: content, title: '', calssName: 'again-login-content' });
    // 设置弹窗层级最高
    setTimeout(() => {
      const dome = Array.prototype.slice.call(document.querySelectorAll('.again-login-content'), 0);
      dome.forEach(item => {
        item.parentNode.style.zIndex = '2147483646';
      })
    }, 320)
  },
  // 移除刷新 token 方法
  removeRefresh() {
    tool.postMessageHand({ type: 'refreshToken', remove: true });
  },
  // 退出登录
  outSystemLogin (config:any = {}) {
    return new Promise(resolve => {
      ElMessageBox.confirm(config.tips || '退出认证中心，已打开的系统将受到影响，是否确认退出？', "提示", {
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
        tool.addModal({ content: content, title: '' });
        certification.removeRefresh();
        tool.postMessageHand({
          type: 'outLogin',
          src: `${tool.recordUrl}${tool.targetPage}`,
          data: {
            cookie: document.cookie,
            prams: {
              ...(config.prams || {}),
              targetUrl: window.location.href
            }
          },
          responseHand: (res:any) => {
            resolve({
              data: res,
              removeModal: () => {
                tool.removeModal();
              },
              defaultHand: (type:any) => {
                setTimeout(() => {
                  tool.removeModal();
                  if (!res) {
                    ElMessage({ message: '退出系统失败，请重新操作!', type: 'error' });
                  } else {
                  // 移除 cookie
                    common.delCookie([cookieConfig.tokenName]);
                    ElMessage({ message: '成功退出系统', type: 'success' });
                    // 返回登录页面
                    setTimeout(() => {
                      certification.goToLogin(typeof type === 'boolean' ? type : true);
                    }, 500)
                  }
                }, 1000)
              }
            });
          }
        })
      }).catch(() => {})
    })
  },
  // 进行 cookie 处理
  authTokenHand (token:any, name:any, type = false) {
    const userInfo = store.getters['layout/userInfo'];
    return new Promise((resolve, reject) => {
      common.setCookie([
        {key: cookieConfig.tokenName, value: `${token.token_type} ${token.access_token}`}
      ]);
      certification.getUserInfo().then((res:any) => {
        // 获取用户信息失败时
        if (!res) return resolve(false);
        store.commit('layout/userInfo', {...res, loginName: name});
        if (userInfo.loginName === name) return resolve(true);
        // 登录用户不一致时
        store.commit('layout/menuTree', []); // 重置菜单
        store.commit('layout/permissionsIds', []); // 重置权限
        // 当旧用户信息和最新登录的用户信息不一致时，刷新页面
        // !type && window.location.reload();
        // 当旧用户信息和最新登录的用户信息不一致时，更新菜单和权限
        certification.getPermissions().then(() => {
          resolve(true)
        })
      })
    })
  },
  // 返回到指定路径, 不带参数返回认证中心首页
  backOauth (url:any = null, type:any = false) {
    const oauthHome = typeof url === 'string' ? url : `${tool.recordUrl}${tool.homePage}?targetEnv=${tool.targetEnv}`;
    window.location.href = oauthHome;
  },
  // 返回到登录页面
  goToLogin (type:boolean = false) {
    const login = `${tool.recordUrl}${tool.loginPage}?targetEnv=${tool.targetEnv}&systemKey=${tool.systemCode}`;
    // 移除 cookie
    common.delCookie([cookieConfig.tokenName]);
    if (!type) {
      certification.backOauth(`${login}&target=${window.location.href}`, true);
    } else {
      certification.backOauth(`${login}`, true);
    }
  },
  // 获取权限以及菜单树
  getPermissions () {
    return new Promise((resolve, reject) => {
      tool.postMessageHand({
        type: 'getPermissions',
        src: `${tool.recordUrl}${tool.targetPage}`,
        data: {
          prams: {
            // 系统代码
            systemCode: tool.systemCode
          }
        },
        responseHand: (res:any) => {
          const addTree = tool.targetEnv === 'dev' && ['localhost', '127.0.0.1'].includes(window.location.hostname) ? navListConfig : [];
          // 存储菜单
          store.commit('layout/menuTree', [...res.menuTree, ...addTree]);
          // store.commit('layout/menuTree', res.menuTree);
          // 存储权限
          store.commit('layout/permissionsIds', res.permissionsIds);
          resolve(res)
        }
      })
    })
  },
  // 保存最新访问地址
  saveTarget () {
    tool.postMessageHand({
      type: 'saveTarget',
      src: `${tool.recordUrl}${tool.targetPage}`,
      data: {
        prams: {
          // 系统代码
          systemCode: tool.systemCode,
          // 地址
          target: window.location.href
        }
      },
      responseHand: (res:any) => {}
    })
  },
  // 获取用户信息
  getUserInfo () {
    return new Promise((resolve, reject) => {
      tool.postMessageHand({
        type: 'getUserInfo',
        src: `${tool.recordUrl}${tool.targetPage}`,
        data: {
          prams: {
            // 系统代码
            systemCode: tool.systemCode
          }
        },
        responseHand: (res:any) => {
          resolve(res)
        }
      })
    })
  },
  // 获取部门树
  getDepartment () {
    return new Promise((resolve, reject) => {
      tool.postMessageHand({
        type: 'getDepartment',
        src: `${tool.recordUrl}${tool.targetPage}`,
        data: {
          prams: {
            // 系统代码
            systemCode: tool.systemCode
          }
        },
        responseHand: (res:any) => {
          resolve(res)
        }
      })
    })
  },
  // message: ElMessage
}
export default certification;
