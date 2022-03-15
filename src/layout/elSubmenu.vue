<template>
  <div>
    <template v-for="(item, index) in menuList" :key="index">
      <!-- 存在子级 -->
      <el-sub-menu v-if="item && !$common.isEmpty(item[defaultProps.children])" :index="item[defaultProps.id]">
        <!-- 菜单父级 -->
        <template v-slot:title>
          <i v-if="!$common.isEmpty(item[defaultProps.icon])" :class="`lapa icon-${item[defaultProps.icon]}`" />
          <span>{{ item[defaultProps.name] }}</span>
        </template>
        <!-- 子级菜单 -->
        <dytSubmenu v-if="!$common.isEmpty(item[defaultProps.children])" :menu-list="item[defaultProps.children]" :default-props="defaultProps" />
      </el-sub-menu>
      <!-- 没子级菜单 -->
      <template v-else-if="item && !$common.isEmpty(item[defaultProps.path])">
        <el-menu-item :index="item[defaultProps.path]"  @click="menuItemClick(item)">
          <i v-if="!$common.isEmpty(item[defaultProps.icon])" :class="`lapa icon-${item[defaultProps.icon]}`" />
          {{ item[defaultProps.name] }}
        </el-menu-item>
      </template>
    </template>
  </div>
</template>
<script>
// import store from '@/store';

export default {
  name: 'DytSubmenu',
  components: {},
  props: {
    // 数据
    menuList: {
      type: Array,
      default: () => []
    },
    // 键值
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          name: 'name',
          id: 'id',
          path: 'url',
          icon: 'icon'
        }
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  // 页面渲染完
  mounted() {},
  // 组件销毁前
  beforeUnmount () {},
  methods: {
    menuItemClick (item) {
      this.$route.path !== item[this.defaultProps.path] && this.$router.push({
        path: `${item[this.defaultProps.path]}`
      })
    }
  }
};
</script>