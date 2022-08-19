import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import pageRouter from "@/router/pageRouter";
import common from '@/utils/common';
import "nprogress/nprogress.css";
import store from "@/store";
// 本地菜单配置
import navListConfig from '@/layout/navListConfig';

if (['dev'].includes(import.meta.env.MODE)) {
  store.commit('layout/menuTree', navListConfig); // 本地运行时本地菜单
  store.commit('layout/userInfo', {userName: 'dev'}); // 本地插入登录人
}

const tool = {
  // 获取菜单所有 path
  getTreePath: (arr:Array<{[key:string]: any}>, treePath:Array<string | number> = [], allItem:Array<{[key:string]: any}> = []) => {
    arr.forEach((item:{[key:string]: any}) => {
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
  setTitle: (treeLsit:Array<{[key:string]: any}> = [], to:any = {}) => {
    const newItem:any = treeLsit.find((item:any) => {
      return item.url === to.path || item.path === to.path
    })
    // 优先使用菜单名称为标题
    if (!common.isEmpty(newItem) && !common.isEmpty(newItem.name)) {
      document.title = `LAPA-${newItem.name}`;
      return;
    }
    // 当不存在标题使用路由标题
    document.title = to.meta && to.meta.title ? `LAPA-${to.meta.title}` : `LAPA-${to.name || '系统'}`;
  },
  // 获取所有路由地址
  getRoutersPath: (arr:any, newRoute:Array<string | number> = []) => {
    arr.forEach((item:any) => {
      newRoute.push(item.path);
      !common.isEmpty(item.children) && tool.getRoutersPath(item.children, newRoute)
    })
    return newRoute;
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
  // 路由地址
  const routePath = tool.getRoutersPath(pageRouter);
  const treeJson = tool.getTreePath(menuTree);
  // 设置标题
  tool.setTitle(treeJson.allItem, to);
  // document.title = to.meta && to.meta.title ? `LAPA-${to.meta.title}` : `LAPA-${to.name || 'APP'}`;
  // 判断路由是否存在
  store.commit('layout/nonExist', !routePath.includes(to.path));
  // 不需要验证登录状态
  if (common.isEmpty(to.meta) || to.meta && typeof to.meta.requireAuth === 'boolean' && !to.meta.requireAuth) {
    next();
    return;
  }
  // 登录验证可在此次写
  next();
});

// 路由跳转后
router.afterEach((to:any, from:any) => {
  NProgress.done();
  store.commit('routerModel/routerLoading', false);
});

export default router;
