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
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: 'DytSubmenu',
  components: {},
  props: {
    // 数据
    menuList: {
      type: Array as unknown as PropType<[]>,
      default: () => []
    },
    // 键值
    defaultProps: {
      type: Object,
      default: () => {
        return { children: 'children', name: 'name', id: 'id', path: 'url', icon: 'icon' }
      }
    }
  },
  // set 无法访问 vue 实例
  setup(props) {
    const $route = useRouter();
    const menuItemClick = (item:any) => {
      $route.currentRoute.value.path !== item[props.defaultProps.path] && $route.push({
        path: `${item[props.defaultProps.path]}`
      })
    }
    // 其他钩子使用 this(即挂载到 vue 实例) 调用 setup 定义的值时, 此次需要返回对应值
    return {
      menuItemClick
    }
  }
});
</script>