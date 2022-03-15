<template>
  <div
    v-loading="navLoadinged"
    class="side-nav-container"
    element-loading-text="菜单加载中..."
  >
    <el-menu
      :default-active="navActive"
      class="nav-item-container"
    >
      <dytSubmenu
        v-model:menu-list="navList"
        :default-props="defaultProps"
      />
    </el-menu>
  </div>
</template>
<script>
import dytSubmenu from './elSubmenu.vue'
import routerPage from '@/router/pageRouter';

export default {
  name: 'SideNav',
  components: { dytSubmenu },
  data() {
    return {
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
    }
  },
  computed: {
    // 当前菜单路由
    navActive () {
      return this.$route.path;
    },
    gettersNavList () {
      return this.$store.getters['layout/menuTree']
    }
  },
  watch: {
    gettersNavList: {
      deep: true,
      handler (val) {
        this.getNavList(val || []);
      }
    }
  },
  created() {
    this.getNavList();
  },
  // 页面渲染完
  mounted() {},
  // 组件销毁前
  beforeUnmount () {},
  methods: {
    // 获取菜单
    getNavList (val) {
      this.navLoadinged = true;
      this.allRouter = {};
      routerPage.forEach(item => {
        this.allRouter[item.path] = item;
      })
      
      const {tree, crumbs} = this.menuTreeHand(val);
      this.navList = tree;
      this.$store.commit('layout/crumbsObj', crumbs);
      this.navLoadinged = false;
    },
    // 处理菜单树、面包屑
    menuTreeHand (tree) {
      const hand = (arr = [], type = false, crumbs = [], newArr = [], newCrumbs = {}) => {
        arr.forEach((item, index) => {
          const children = item[this.defaultProps.children];
          delete item[this.defaultProps.children];
          crumbs = type ? [item[this.defaultProps.name]] : !this.$common.isEmpty(children) ? [...crumbs, item[this.defaultProps.name]] : crumbs;
          if (!this.$common.isEmpty(item[this.defaultProps.path])) {
            if (type) {
              newCrumbs[item[this.defaultProps.path]] = [item[this.defaultProps.name]];
            } if(!this.$common.isEmpty(children)) {
              newCrumbs[item[this.defaultProps.path]] = crumbs;
            } else {
              newCrumbs[item[this.defaultProps.path]] = [...crumbs, item[this.defaultProps.name]];
            }
          }
          item['vueRouterMeta'] = this.$common.isEmpty(this.allRouter[item.url]) ? {} : this.allRouter[item.url].meta || {};
          // 设置隐藏的菜单不添加到菜单
          !item.vueRouterMeta.hidden && newArr.push(item);
          if (!this.$common.isEmpty(children)) {
            newArr[index][this.defaultProps.children] = [];
            hand(children, false, crumbs, newArr[index][this.defaultProps.children], newCrumbs);
          }
        })
        return { tree: newArr, crumbs: newCrumbs };
      }
      return hand(this.$common.copy(tree), true);
    }
  }
};
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