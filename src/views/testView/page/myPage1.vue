<template>
  <div style="padding: 60px">
    common.js 测试
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import getGlobal from "@/utils/global";
const global = getGlobal();
// let ddd = new Date();
// console.log(global.$common.toLocaleDate('', 'YYYY-MM-DD HH:mm:ss:SSS'), global.$common.toISODate('', 'YYYY-MM-DD HH:mm:ss:SSS'));

const mytest = (val:any) => {
  console.log('on', val)
}

global.$bus.on('mytest', mytest);
global.$bus.on('mytest1', mytest);

// 销毁组件前解绑订阅
onBeforeUnmount(() => {
  global.$bus.off('mytest', mytest);
  global.$bus.off('mytest1', mytest);
})

</script>
