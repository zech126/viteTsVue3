<template>
  <div class="crumbs-container">
    <span>{{ `${getCrumbs.before ? `${getCrumbs.before} / ` : ''}` }}</span>
    <span class="crumbs-active">{{ getCrumbs.after }}</span>
  </div>
</template>
<script>

export default {
  name: 'Crumbs',
  components: {},
  data() {
    return {}
  },
  computed: {
    getCrumbs () {
      const path = this.$route.path;
      if (this.$common.isEmpty(path) || path === '/') return {before: '', after: ''};
      let crumbsObj = this.$common.copy(this.$store.getters['layout/crumbsObj'][path] || []);
      const last = crumbsObj.splice(-1);
      return {
        before: crumbsObj.join(' / '),
        after: last.join(' / ')
      };
    }
  },
  watch: {},
  created() {},
  // 页面渲染完
  mounted() {},
  // 组件销毁前
  beforeUnmount () {},
  
  methods: {}
};
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