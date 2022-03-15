export default {
  // 模块名称
  moduleName: 'layout',
  // 全局数据
  state: {
    userInfo: {},
    crumbsObj: {},
    menuTree: [],
    noAccess: false,
    nonExist: false,
    permissionsIds: []
  },
  // 对数据同步更新
  mutations: {
    // 用户信息
    userInfo (state:any, data:any) {
      state.userInfo = data;
    },
    // 面包屑
    crumbsObj (state:any, data:any) {
      state.crumbsObj = data;
    },
    // 菜单树
    menuTree (state:any, data:any) {
      state.menuTree = data;
    },
    // 是否有权访问
    noAccess (state:any, data:any) {
      state.noAccess = data;
    },
    // 是否存在路由
    nonExist (state:any, data:any) {
      state.nonExist = data;
    },
    // 权限
    permissionsIds (state:any, data:any) {
      state.permissionsIds = data;
    }
  },
  // 对数据异步更新
  actions: {},
  // 可以理解为computed ，对 state 进行计算处理, 直接对 参数修改会更改到 state
  getters: {
    userInfo (state:any) {
      return state.userInfo
    },
    crumbsObj (state:any) {
      return state.crumbsObj
    },
    menuTree (state:any) {
      return state.menuTree
    },
    noAccess (state:any) {
      return state.noAccess
    },
    nonExist (state:any) {
      return state.nonExist
    },
    permissionsIds (state:any) {
      return state.permissionsIds
    }
  }
}