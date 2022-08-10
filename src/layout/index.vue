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
import headerDemo from './header.vue';
import sideNavDemo from './sideNav.vue';
import crumbs from './crumbs.vue';
import noAccessView from './401.vue';
import nonExistView from './404.vue';
import { useStore } from "vuex";

const store = useStore();
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
  background: var(--dyt-main-background-color);
  .app-header{
    height: var(--layout-head-height);
    line-height: var(--layout-head-height);
    background: var(--layout-head-background);
  }
  .app-main-container{
    height: calc(100% - var(--layout-head-height));
    .app-aside{
      position: relative;
      width: var(--layout-aside-width);
      height: 100%;
      background: var(--layout-aside-background);
      border-radius: 0 0 5px 5px;
      box-shadow: 1px 0 5px 1px var(--layout-shadow-color);
      overflow: hidden;
      z-index: 10;
    }
    .app-main {
      padding: 0;
      height: 100%;
      .layout-main-pages{
        padding: 0;
        height: calc(100% - var(--layout-crumbs-height));
        background: var(--layout-main-background-color);
        overflow: auto;
      }
    }
  }
}
</style>