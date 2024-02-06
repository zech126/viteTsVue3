<template>
  <el-container class="app-container">
    <!-- 头部 -->
    <el-header class="app-header" v-show="!data.hiddenHeader">
      <header-demo />
    </el-header>
    <el-container class="app-main-container">
      <!-- 左侧菜单 -->
      <el-aside class="app-aside" v-show="!data.hiddenLeftSide">
        <sideNavDemo />
      </el-aside>
      <!-- 主体 -->
      <el-main class="app-main">
        <crumbs v-show="!data.hiddenCrumbs" />
        <div
          v-loading="loadingPage"
          class="layout-main-pages"
          :element-loading-text="data.loadingTxt"
          :class="{'hidden-crumbs': data.hiddenCrumbs}"
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
import { reactive, computed, watch, PropType, ComputedRef } from 'vue';
import getGlobal from "@/utils/global";
import headerDemo from './header.vue';
import sideNavDemo from './sideNav.vue';
import crumbs from './crumbs.vue';
import noAccessView from './401.vue';
import nonExistView from './404.vue';
import { useStore } from "vuex";

const global = getGlobal();
const store = useStore();

const props = defineProps({
  routeInfo: { type: Object as PropType<{[key:string]:any}>, default: () => {return {}} }
})

let data = reactive({
  loadingTxt: '页面加载中，请稍后...',
  // 是否隐藏头
  hiddenHeader: true,
  // 是否隐藏左侧菜单
  hiddenLeftSide: true,
  // 是否隐藏面包屑
  hiddenCrumbs: true
});
const loadingPage = computed(() => store.getters['routerModel/routerLoading']);
const noAccess = computed(() => store.getters['layout/noAccess']);
const nonExist = computed(() => store.getters['layout/nonExist']);
const meta:ComputedRef<{[key:string]:any}> = computed(() => {
  if (global.$common.isEmpty(props.routeInfo)) return {};
  return props.routeInfo.meta || {};
});
watch(() => meta, (val) => {
  if (global.$common.isEmpty(val.value)) {
    // data.hiddenHeader = false;
    // data.hiddenLeftSide = false;
    // data.hiddenCrumbs = false;
    return;
  }
  data.hiddenHeader = global.$common.isEmpty(val.value.hiddenHeader) ? false : val.value.hiddenHeader;
  data.hiddenLeftSide = global.$common.isEmpty(val.value.hiddenLeftSide) ? false : val.value.hiddenLeftSide;
  data.hiddenCrumbs = global.$common.isEmpty(val.value.hiddenCrumbs) ? false : val.value.hiddenCrumbs;
}, {deep: true, immediate: true});
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
        &.hidden-crumbs{
          height: 100%;
        }
        > :deep(*){
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
}
</style>