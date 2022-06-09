<template>
  <div>
    <template v-for="(item, index) in menuList" :key="index">
      <!-- 存在子级 -->
      <el-sub-menu v-if="item && !$common.isEmpty(item[props.defaultProps.children])" :index="item[props.defaultProps.id]">
        <!-- 菜单父级 -->
        <template v-slot:title>
          <i v-if="!$common.isEmpty(item[props.defaultProps.icon])" :class="`lapa icon-${item[props.defaultProps.icon]}`" />
          <span>{{ item[props.defaultProps.name] }}</span>
        </template>
        <!-- 子级菜单 -->
        <dytSubmenu
          v-if="!$common.isEmpty(item[props.defaultProps.children])"
          :menu-list="item[props.defaultProps.children]"
          :default-props="props.defaultProps"
        />
      </el-sub-menu>
      <!-- 没子级菜单 -->
      <template v-else-if="item && !$common.isEmpty(item[props.defaultProps.path])">
        <el-menu-item :index="item[props.defaultProps.path]"  @click="menuItemClick(item)">
          <i v-if="!$common.isEmpty(item[defaultProps.icon])" :class="`lapa icon-${item[props.defaultProps.icon]}`" />
          {{ item[props.defaultProps.name] }}
        </el-menu-item>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { useRouter } from "vue-router";
import dytSubmenu from './elSubmenu.vue';

const props = defineProps({
  // 数据
  menuList: {
    type: Array as PropType<{[key:string]:any}[]>,
    default: () => []
  },
  // 键值
  defaultProps: {
    type: Object as PropType<{
      children: string,
      name: string,
      id: string,
      path: string,
      icon: string
    }>,
    default: () => {
      return { children: 'children', name: 'name', id: 'id', path: 'url', icon: 'icon' }
    }
  }
});

const $route = useRouter();
const menuItemClick = (item:any) => {
  if (props.defaultProps.path) {
    $route.currentRoute.value.path !== item[props.defaultProps.path] && $route.push({
      path: `${item[props.defaultProps.path]}`
    })
  }
}
</script>