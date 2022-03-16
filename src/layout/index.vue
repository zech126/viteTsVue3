<template>
  <el-container class="app-container">
    <!-- 头部 -->
    <el-header class="app-header">
      <header-demo />
    </el-header>
    <el-container class="app-main-container">
      <!-- 左侧菜单 -->
      <el-aside class="app-aside">
        <sideNavDemo />
      </el-aside>
      <!-- 主体 -->
      <el-main class="app-main">
        <crumbs />
        <div class="layout-main-pages" v-loading="loadingPage" :element-loading-text="loadingTxt">
          <noAccessView v-if="noAccess" />
          <nonExistView v-else-if="nonExist" />
          <slot v-else />
        </div>
      </el-main>
      <!-- <el-footer class="app-footer">Footer</el-footer> -->
    </el-container>
  </el-container>
</template>
<script lang="ts">
import store from '@/store'
import headerDemo from './header.vue'
import sideNavDemo from './sideNav.vue'
import crumbs from './crumbs.vue'
import noAccessView from './401.vue'
import nonExistView from './404.vue'

export default {
  name: 'SideNav',
  components: {headerDemo, sideNavDemo, crumbs, noAccessView, nonExistView},
  data() {
    return {
      loadingTxt: '页面加载中，请稍后...'
    }
  },
  computed: {
    loadingPage () {      
      return store.getters['routerModel/routerLoading'];
    },
    noAccess () {
      return store.getters['layout/noAccess'];
    },
    nonExist () {
      return store.getters['layout/nonExist'];
    }
  },
  created() {
    this.initPage();
  },
  // 页面渲染完
  mounted() {},
  // 组件销毁前
  beforeUnmount () {},
  methods: {
    initPage () {}
  }
};
</script>
<style lang="less" scoped>
.app-container{
  position: relative;
  height: 100%;
  background: @main-background;
  .app-header{
    height: @head-height;
    line-height: @head-height;
    background: @head-background;
  }
  .app-main-container{
    height: calc(100% - @head-height);
    .app-aside{
      position: relative;
      width: @aside-width;
      height: 100%;
      background: @aside-background;
      border-radius: 0 0 5px 5px;
      box-shadow: 1px 0 5px 1px @layout-shadow;
      overflow: hidden;
      z-index: 10;
    }
    .app-main {
      padding: 0;
      height: 100%;
      .layout-main-pages{
        padding: 15px 20px 10px 20px;
        height: calc(100% - @crumbs-height);
        background: #fff;
      }
    }
  }
}
</style>