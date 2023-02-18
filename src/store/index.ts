import { createStore } from "vuex";
import storeGetters from "@/store/storeGetters";
import layout from "@/layout/storeConfig";
import routerModule from '@/router/storeConfig';
import { cloneDeep } from 'lodash';

const other:any = [layout, routerModule];

// store 入口设置
let storeMaps = {
  namespaced: true,
  // 全局数据
  state: {
    pendingList: new Map()
  },
  // 对数据同步更新
  mutations: {
    // 添加请求到登录列表里
    pushPending (state: {[key:string]: any}, data:{requestKey: string, cancel: { (message?: string): void }}) {
      state.pendingList.set(data.requestKey, data.cancel);
    },
    // 移除等待中的请求
    deletePending (state: {[key:string]: any}, data?: string) {
      state.pendingList.delete(data);
    },
    // 取消所有等待中的请求
    cancelAllPending (state: {[key:string]: any}, data: string = '该请求被主动取消') {
      for(let [key, value] of state.pendingList) {
        // 取消
        value(`${data}: ${key}`);
        // 移除
        state.pendingList.delete(key);
      }
    }
  },
  // 对数据异步更新
  actions: {
    // upDateTestData (context, playload) {
    //   setTimeout(function () {
    //     context.commit("testData", playload);
    //   }, 2000)
    // }
  },
  // 可以理解为computed ，对 state 进行计算处理, 直接对参数修改会更改到 state， 不建议直接更改 state
  getters: {
    // 返回等待中的请求
    getPendingList (state: {[key:string]: any}) {
      return state.pendingList;
    },
    ...storeGetters,
  },
  // 对数据进行模块区分，模块功能或数据比较多时候建议使用
  modules: {
    // moduleA: {
    //   state: {},
    //   mutations: {},
    //   actions: {},
    //   getters: {}
    // },
    // moduleB: {
    //   state: {},
    //   mutations: {},
    //   actions: {},
    //   getters: {}
    // }
  },
};
// 调用 mutations 时
// this.$store.commit('mutationName', '更新的数据')
// this.$store.commit('modulesName/mutationName', '更新的数据')     // 区分模块
// 调用 actions 时
// this.$store.dispatch("actionsName", '更新的数据')
// this.$store.dispatch("modulesName/actionsName", '更新的数据')    // 区分模块

// this.$store.state['stateName']
// this.$store.state['modulesName']['stateName']      // 区分模块时

// this.$store.getters['stateName']
// this.$store.getters['modulesName/stateName']      // 区分模块

// 获取所有 views 目录下一级的 storeConfig.js 文件
const tsFiles = import.meta.globEager("../views/**/storeConfig.ts");
const jsFiles = import.meta.globEager("../views/**/storeConfig.js");
const files:{[key:string]: any} = {...tsFiles, ...jsFiles};
const hand = (obj:any) => {
  const moduleName = obj.moduleName;
  delete obj.moduleName;
  if (typeof moduleName === "string" && moduleName.length > 0) {
    // 命名模块名，存在自定义模块时
    if (obj.modules) {
      storeMaps.modules = { ...storeMaps.modules, ...(obj.modules || {}) };
    }
    delete obj.modules;
    // let newModules:Object = {};
    storeMaps.modules[moduleName] = {
      namespaced: true,
      ...(storeMaps.modules[moduleName] || {}),
      ...(obj || {}),
    };
    // storeMaps.modules = {...storeMaps.modules, ...newModules}
  } else {
    storeMaps.state = { ...storeMaps.state, ...(obj.state || {}) };
    storeMaps.mutations = { ...storeMaps.mutations, ...(obj.mutations || {}) };
    storeMaps.actions = { ...storeMaps.actions, ...(obj.actions || {}) };
    storeMaps.getters = { ...storeMaps.getters, ...(obj.getters || {}) };
    // 模块不为空时
    if (obj.modules) {
      storeMaps.modules = { ...storeMaps.modules, ...(obj.modules || {}) };
    }
  }
};

other.forEach((item:any) => {
  hand(cloneDeep(item));
});

// 如出现重复，则会被覆盖
Object.keys(files).forEach((key) => {
  hand(cloneDeep(files[key].default || {}));
});

// 创建 store
const store = createStore(storeMaps);

export default store;
