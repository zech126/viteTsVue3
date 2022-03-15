<template>
  <div>
    <template v-for="(item, index) in menuList.value" :key="`menu-${index}`">
      <!-- 存在子级 -->
      <el-sub-menu v-if="item && !$common.isEmpty(item[defaultProps.children])" :index="item[defaultProps.id]">
        <!-- 菜单父级 -->
        <template v-slot:title>
          <i v-if="!$common.isEmpty(item[defaultProps.icon])" :class="`lapa icon-${item[defaultProps.icon]}`" />
          <span>{{ item[defaultProps.name] }}</span>
        </template>
        <!-- 子级菜单 -->
        <!-- 递归组件在 setup 无法命名 -->
        <!-- <dytSubmenu v-if="!$common.isEmpty(item[defaultProps.children])" :menu-list="item[defaultProps.children]" :default-props="defaultProps" /> -->
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
<script lang="ts" setup>
import { reactive, watch, defineProps, computed } from 'vue';
import { useRouter } from "vue-router";
// 定义参数类型
interface Props {
  menuList?: any,
  defaultProps: any
}
// 接收参数
const props = withDefaults(defineProps<Props>(),{
  menuList: () => [],
  defaultProps: () => {
    return {
      children: 'children',
      name: 'name',
      id: 'id',
      path: 'url',
      icon: 'icon'
    }
  }
})

const computedVal = computed(() => {
  return 123;
})
console.log(computedVal);

let menuList:any = reactive([]);
const $route = useRouter();
watch(() => props.menuList, (val, oldVal) => {
  menuList.value = val;
})
const menuItemClick = (item:any) => {
  $route.currentRoute.value.path !== item[props.defaultProps.path] && $route.push({
    path: `${item[props.defaultProps.path]}`
  })
}
</script>