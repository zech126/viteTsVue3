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
        <div
          v-loading="loadingPage"
          class="layout-main-pages"
          :element-loading-text="data.loadingTxt"
        >
          <noAccessView v-if="noAccess" />
          <nonExistView v-else-if="nonExist" />
          <slot v-else />
        </div>
      </el-main>
      <!-- <el-footer class="app-footer">Footer</el-footer> -->
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
import store from '@/store';
import headerDemo from './header.vue';
import sideNavDemo from './sideNav.vue';
import crumbs from './crumbs.vue';
import noAccessView from './401.vue';
import nonExistView from './404.vue';

let data = reactive({
  loadingTxt: '页面加载中，请稍后...'
});
const loadingPage = computed(() => store.getters['routerModel/routerLoading']);
const noAccess = computed(() => store.getters['layout/noAccess']);
const nonExist = computed(() => store.getters['layout/nonExist']);
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