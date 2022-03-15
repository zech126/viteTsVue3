export default {
  // 账号
  userAccount: (state:any) => {
    if (!state.layout || !state.layout.userInfo) return '';
    return state.layout.userInfo.loginName || '';
  },
  // 用户名
  userName: (state:any) => {
    if (!state.layout || !state.layout.userInfo || !state.layout.userInfo.securityUser) return '';
    return state.layout.userInfo.securityUser.name || '';
  },
  // 用户ID
  userId: (state:any) => {
    if (!state.layout || !state.layout.userInfo) return '';
    return state.layout.userInfo.userId || '';
  },
};
