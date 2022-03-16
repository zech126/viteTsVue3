<template>
  <div class="crumbs-container">
    <span>{{ `${getCrumbs.before ? `${getCrumbs.before} / ` : ''}` }}</span>
    <span class="crumbs-active">{{ getCrumbs.after }}</span>
  </div>
</template>
<script lang="ts">
import store from '@/store';
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import common from '@/utils/common';

export default defineComponent({
  name: 'crumbs',
  setup (props) {
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
    return {
      getCrumbs
    }
  }
})
</script>
<style lang="less" scoped>
.crumbs-container{
  position: relative;
  height: @crumbs-height;
  line-height: @crumbs-height;
  padding: 0 20px;
  color: #888;
  font-size: 12px;
  box-shadow: 0 1px 5px 1px @layout-shadow inset;
  z-index: 7;
  .crumbs-active{
    color: @font-corlor;
  }
}
</style>