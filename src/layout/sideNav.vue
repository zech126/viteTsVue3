<template>
  <div v-loading="data.navLoadinged" class="side-nav-container" element-loading-text="菜单加载中...">
    <el-menu :default-active="navActive" class="nav-item-container">
      <dytSubmenu :menu-list="data.navList" :default-props="data.defaultProps" />
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import dytSubmenu from './elSubmenu.vue'
import routerPage from '@/router/pageRouter';
import store from '@/store';
import common from '@/utils/common';

// 定义类型
interface dataType {
  navList: any;
  navLoadinged:boolean;
  defaultProps: {
    children: string;
    name: string;
    id: string;
    path: string;
    icon: string;
  };
  allRouter: any;
}

// 相当于 data
let data:dataType = reactive({
  navList: [],
  navLoadinged: false,
  // 菜单键值替换
  defaultProps: {
    // 子级
    children: 'childList',
    // 名称
    name: 'name',
    // id
    id: 'id',
    // 菜单路径（路由）
    path: 'url',
    // 图标
    icon: 'icon'
  },
  allRouter: {}
})
// 获取路由对象
const $route = useRouter();

const navActive = computed(() => {
  return $route.currentRoute.value.path;
})
const gettersNavList = computed(() => {
  return store.getters['layout/menuTree']
})
// 监听变化
watch([gettersNavList], ([val], [oldVal]) => {
  getNavList(val || []);
})

const getNavList = (val:any = []) => {
  data.navLoadinged = true;
  data.allRouter = {};
  routerPage.forEach(item => {
    data.allRouter[item.path] = item;
  })
  
  const {tree, crumbs} = menuTreeHand(val);
  data.navList = tree;
  store.commit('layout/crumbsObj', crumbs);
  data.navLoadinged = false;
}
// 处理菜单树、面包屑
const menuTreeHand = (tree:any) => {
  const hand = (arr:any = [], type:any = false, crumbs:any = [], newArr:any = [], newCrumbs:any = {}) => {
    arr.forEach((item:any, index:any) => {
      const children = item[data.defaultProps.children];
      delete item[data.defaultProps.children];
      crumbs = type ? [item[data.defaultProps.name]] : !common.isEmpty(children) ? [...crumbs, item[data.defaultProps.name]] : crumbs;
      if (!common.isEmpty(item[data.defaultProps.path])) {
        if (type) {
          newCrumbs[item[data.defaultProps.path]] = [item[data.defaultProps.name]];
        } else if(!common.isEmpty(children)) {
          newCrumbs[item[data.defaultProps.path]] = crumbs;
        } else {
          newCrumbs[item[data.defaultProps.path]] = [...crumbs, item[data.defaultProps.name]];
        }
      }
      item['vueRouterMeta'] = common.isEmpty(data.allRouter[item.url]) ? {} : data.allRouter[item.url].meta || {};
      // 设置隐藏的菜单不添加到菜单
      !item.vueRouterMeta.hidden && newArr.push(item);
      if (!common.isEmpty(children)) {
        newArr[index][data.defaultProps.children] = [];
        hand(children, false, crumbs, newArr[index][data.defaultProps.children], newCrumbs);
      }
    })
    return { tree: newArr, crumbs: newCrumbs };
  }
  return hand(common.copy(tree), true);
}
</script>
<style lang="less" scoped>
.side-nav-container{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .nav-item-container{
    height: 100%;
    overflow: auto;
  }
  .el-menu{
    border: none;
  }
  .el-menu-item{
    &.is-active{
      background: #409EFF;
      color: #fff;
    }
  }
}
</style>