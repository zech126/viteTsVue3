import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import pageRouter from "./pageRouter";
import common from '@/utils/common';
import record from '@/utils/certificationCenter';
import "nprogress/nprogress.css";
import store from "@/store";
import cookieConfig from "@/utils/cookieConfig";

const tool = {
  isRefreshToken: false,
  // 刷新 token 调用
  refreshToken: () => {
    if (!tool.isRefreshToken) {
      record.refreshToken();
      tool.isRefreshToken = true;
    }
  },
  // 获取所有路由地址
  getRoutersPath: (arr:any, newRoute:Array<string | number> = []) => {
    arr.forEach((item:any) => {
      newRoute.push(item.path);
      !common.isEmpty(item.children) && tool.getRoutersPath(item.children, newRoute)
    })
    return newRoute;
  },
  // 获取菜单所有 path
  getTreePath: (arr:any, treePath:Array<string | number> = [], allItem:Array<string | number> = []) => {
    arr.forEach((item:any) => {
      !common.isEmpty(item.url || item.path) && treePath.push(item.url || item.path);
      allItem.push(item);
      if (!common.isEmpty(item.childList)) {
        tool.getTreePath(item.childList, treePath, allItem)
      } else if (!common.isEmpty(item.children)) {
        tool.getTreePath(item.children, treePath, allItem)
      }
    })
    return { treePath: treePath, allItem: allItem };
  },
  // 设置页面标题
  setTitle: (treeLsit:Array<string | number> = [], to:any = {}) => {
    const newItem:any = treeLsit.find((item:any) => {
      return item.url === to.path || item.path === to.path
    })
    // 优先使用菜单名称为标题
    if (!common.isEmpty(newItem) && !!newItem.name) {
      document.title = `LAPA-${newItem.name}`;
      return;
    }
    // 当不存在标题使用路由标题
    if (to.name) {
      document.title = `LAPA-${(to.params.type && to.meta.title && common.isObject(to.meta.title))?to.meta.title[to.params.type] || '' : to.name}`;
    } else {
      document.title = 'LAPA 系统';
    }
  },
  routeNext: (routePath:any, to:any, next:any) => {
    const navList = store.getters['layout/menuTree'] || [];
    const treeJson = tool.getTreePath(navList);
    // 设置标题
    tool.setTitle(treeJson.allItem, to);
    store.commit('layout/nonExist', false);
    store.commit('layout/noAccess', routePath.includes(to.path) && (!treeJson.treePath.includes(to.path) || !treeJson.treePath[0]));
    next();
  },
  routerValidation: (menuTree:any, routePath:any, to:any, next:any) => {
    // 验证 token 是否有效
    record.validationHand().then((validation:any) => {
      if (!validation.success) {
        store.commit('routerModel/routerLoading', false);
        NProgress.done();
        record[validation.tagert === 'login' ? 'goToLogin' : 'againLogin'](true);
        return;
      }
      // 当菜单为空时，请求接口获取菜单
      (common.isEmpty(menuTree) || menuTree.length === 0) ? record.getPermissions().then(res => {
        tool.routeNext(routePath, to, next);
      }) : tool.routeNext(routePath, to, next);
    })
  }
}

const router = createRouter({
  /* 
    history 配置： createWebHashHistory 使用 hash 模式， createWebHistory html5 历史模式, 
    均需在 import vue-router 时定义方法名称
  */
  history: createWebHashHistory(), // 使用 hash 模式
  routes: [
    {
      name: "首页",
      path: "/",
      redirect: "tableTest",
    },
    ...pageRouter,
  ],
});

// 路由跳转前
router.beforeEach((to:any, from:any, next:any) => {
  // 路由加载状态
  store.commit('routerModel/routerLoading', true);
  NProgress.start();
  // 获取菜单
  const menuTree = store.getters['layout/menuTree'];
  const routePath = tool.getRoutersPath(pageRouter);
  // 获取的信息
  record.recordCertification().then((info:any) => {
    // 不需要验证登录状态
    if (common.isEmpty(to.meta) || to.meta && typeof to.meta.requireAuth === 'boolean' && !to.meta.requireAuth) {
      const treeJson = tool.getTreePath(menuTree);
      store.commit('layout/noAccess', false);
      store.commit('layout/nonExist', !routePath.includes(to.path));
      // 设置标题
      tool.setTitle(treeJson.allItem, to);
      (common.isEmpty(menuTree) || menuTree.length === 0) ? record.getPermissions().then(res => {
        next();
      }) : next();
      return;
    }
    if (common.isEmpty(store.getters['layout/userInfo']) && !common.isEmpty(info.userInfo) && !common.isEmpty(info.login)) {
      store.commit('layout/userInfo', {...(info.userInfo || {}), loginName: info.login.loginName});
    }
    // 获取不到登录信息，跳转登录
    if (common.isEmpty(info.token) || common.isEmpty(info.login)) {
      NProgress.done();
      store.commit('routerModel/routerLoading', false);
      record.goToLogin();
      return;
    }
    // 当获取到登录信息和当前不一致，覆盖当前登录信息
    const DYTToken = common.getCookie(cookieConfig.tokenName);
    const token = `${info.token.token_type} ${info.token.access_token}`;
    // 当获取到登录信息和当前不一致，覆盖当前登录信息
    if (!DYTToken || DYTToken !== token) {
      record.authTokenHand(info.token, info.login.loginName).then(() => {
        // 验证
        tool.routerValidation(menuTree, routePath, to, next);
      });
      return;
    }
    // 验证
    tool.routerValidation(menuTree, routePath, to, next);
  }).catch(() => {
    const treeJson = tool.getTreePath(menuTree);
    // 设置标题
    tool.setTitle(treeJson.allItem, to);
  })
});

// 路由跳转后
router.afterEach((to:any, from:any) => {
  NProgress.done();
  store.commit('routerModel/routerLoading', false);
});

export default router;
