<template>
  <div class="crumbs-container">
    <span>{{ `${getCrumbs.before ? `${getCrumbs.before} / ` : ''}` }}</span>
    <span class="crumbs-active">{{ getCrumbs.after }}</span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import common from '@/utils/common';
import { useStore } from "vuex";

const store = useStore();

const $route = useRouter();
const getCrumbs = computed(() => {
  const path = $route.currentRoute.value.path;
  if (common.isEmpty(path) || path === '/') return {before: '', after: ''};
  let crumbsObj = common.copy(store.getters['layout/crumbsObj'][path] || []);
  const last = crumbsObj.splice(-1);
  return {
    before: crumbsObj.join(' / '),
    after: last.join(' / ')
  };
})
</script>
<style lang="less" scoped>
.crumbs-container{
  position: relative;
  height: var(--layout-crumbs-height);
  line-height: var(--layout-crumbs-height);
  padding: 0 20px;
  color: #888;
  font-size: 12px;
  box-shadow: 0 1px 5px 1px var(--layout-shadow-color) inset;
  z-index: 7;
  .crumbs-active{
    color: var(--dyt-font-corlor);
  }
}
</style>