export default {
  moduleName: 'routerModel',
  state: {
    routerLoading: false
  },
  // 对数据同步更新
  mutations: {
    routerLoading (state:any, data:any) {
      state.routerLoading = data;
    }
  },
  // 对数据异步更新
  actions: {},
  // 可以理解为computed ，对 state 进行计算处理, 直接对 参数修改会更改到 state
  getters: {
    routerLoading: (state:any) => {
      return state.routerLoading
    }
  }
}